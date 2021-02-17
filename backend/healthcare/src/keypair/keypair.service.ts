import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { MoreThan, Repository } from "typeorm";
import { CreateKeypairDto, IsActiveResponseDto } from "./keypair.dto";
import { AES, enc, SHA256 } from "crypto-js";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import StellarSdk from "stellar-sdk";
import { UserRole } from "src/constant/enum/user.enum";
import { UserService } from "src/user/user.service";
import { User } from "src/entities/user.entity";
import { UserToken } from "src/entities/user-token.entity";
import { Member } from "src/entities/member.entity";
import axios from "axios";
import { Patient } from "src/entities/patient.entity";

@Injectable()
export class KeypairService {
  private readonly stellarReceivingSecret;
  private readonly stellarIssuingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepositoy: Repository<Member>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly stellarService: StellarService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.stellarReceivingSecret = this.configService.get<string>(
      "stellar.receivingSecret"
    );
    this.stellarIssuingSecret = this.configService.get<string>("stellar.issuingSecret");
  }

  async encryptPrivateKey(
    userId: number,
    pin: string,
    privateKey: string
  ): Promise<string> {
    const user = await this.userService.findById(userId, true);
    let userSalt: string;
    if (user.role === UserRole.HospitalAdmin || user.role === UserRole.Hospital) {
      userSalt = user.hospital.code9;
    } else if (user.role === UserRole.Patient) {
      userSalt = user.patient.nationalId;
    } else {
      throw new BadRequestException(`${user.role} role can't create keypair`);
    }

    const salt = genSaltSync(10);
    const encryptKey = hashSync(SHA256(userSalt) + pin, salt);
    const encryptedPrivateKey = AES.encrypt(privateKey, encryptKey).toString();
    return `${salt}$$$${encryptedPrivateKey}`;
  }

  async createKeypair(userId: number, pin: string, agencyId?: number): Promise<Keypair> {
    const user = await this.userService.findById(userId);

    const existedKeypair = await this.findActiveKeypair(userId, agencyId);
    if (existedKeypair) {
      throw new BadRequestException("Keypair is already existed");
    }

    const keypair = await this.stellarService.createAccount(
      this.stellarReceivingSecret,
      2
    );

    const encryptedPrivateKey = await this.encryptPrivateKey(
      userId,
      pin,
      keypair.privateKey
    );
    const receivingKeys = StellarSdk.Keypair.fromSecret(this.stellarReceivingSecret);
    const accontMergeXdr = await this.stellarService.createAccountMergeXdr(
      keypair.privateKey,
      receivingKeys.publicKey()
    );

    const hashPin = hashSync(pin);

    const newKeypair = new Keypair();
    newKeypair.encryptedPrivateKey = encryptedPrivateKey;
    newKeypair.publicKey = keypair.publicKey;
    newKeypair.hashPin = hashPin;
    newKeypair.users = [user];
    newKeypair.accountMergeXdr = accontMergeXdr;
    newKeypair.agency = agencyId ? await this.userService.findById(agencyId) : null;
    return await this.keypairRepository.save(newKeypair);
  }

  async addHospitalKeypair(userId: number, hospitalUserId: number): Promise<void> {
    const hospital = await this.userService.findById(hospitalUserId);
    const keypair = await this.findActiveKeypair(userId);
    hospital.keypairs = [...hospital.keypairs, keypair];
    await this.userRepository.save(hospital);
  }

  async decryptPrivateKeyFromKeypair(
    userId: number,
    pin: string,
    keypair: Keypair
  ): Promise<string> {
    const user = await this.userService.findById(userId, true);
    let userSalt: string;
    if (user.role === UserRole.HospitalAdmin || user.role === UserRole.Hospital) {
      userSalt = user.hospital.code9;
    } else if (user.role === UserRole.Patient) {
      userSalt = user.patient.nationalId;
    } else {
      throw new BadRequestException(`${user.role} role doesn't have keypair`);
    }

    const [salt, encryptedPrivateKey] = keypair.encryptedPrivateKey.split("$$$");
    const encryptKey = hashSync(SHA256(userSalt) + pin, salt);
    const privateKey = AES.decrypt(encryptedPrivateKey, encryptKey).toString(enc.Utf8);
    if (!privateKey) {
      throw new BadRequestException("Invalid PIN");
    }
    return privateKey;
  }

  async decryptPrivateKey(
    userId: number,
    pin: string,
    agencyId?: number
  ): Promise<string> {
    const keypair = await this.findActiveKeypair(userId, agencyId);
    if (!keypair) {
      throw new BadRequestException("Cannot find keypair for this user");
    }

    const privateKey = await this.decryptPrivateKeyFromKeypair(userId, pin, keypair);

    return privateKey;
  }

  async findPublicKey(userId: number, agencyId?: number): Promise<string> {
    const keypair = await this.findActiveKeypair(userId, agencyId);
    return keypair.publicKey;
  }

  async isActive(userId: number, agencyId?: number): Promise<IsActiveResponseDto> {
    const keypair = await this.findActiveKeypair(userId, agencyId);
    return { isActive: !!keypair };
  }

  async changePin(userId: number, currentPin: string, newPin: string): Promise<void> {
    const keypairs = await this.findAllActiveKeypair(userId);

    for (const keypair of keypairs) {
      const pk = await this.decryptPrivateKeyFromKeypair(userId, currentPin, keypair);
      const newEncryptedPrivateKey = await this.encryptPrivateKey(userId, newPin, pk);
      keypair.encryptedPrivateKey = newEncryptedPrivateKey;
      const newHashPin = hashSync(newPin);
      keypair.hashPin = newHashPin;
      await this.keypairRepository.save(keypair);
    }
  }

  async recover(userId: number, pin: string): Promise<void> {
    const keypairs = await this.findAllActiveKeypair(userId);
    for(let keypair of keypairs) {
      keypair.isActive = false;
    }
    await this.keypairRepository.save(keypairs)

    await this.createKeypair(userId, pin);

    const issuingKeys = StellarSdk.Keypair.fromSecret(this.stellarIssuingSecret);
    const privateKey = await this.decryptPrivateKey(userId, pin);

    const user = await this.userRepository.findOneOrFail(userId, {
      relations: ["patient", "userTokens", "userTokens.healthcareToken"],
    });
    const { userTokens } = user;
    for(let userToken of userTokens) {
      if (userToken.healthcareToken.issuingPublicKey === issuingKeys.publicKey()) {
        await this.stellarService.issueToken(
          this.stellarIssuingSecret,
          privateKey,
          userToken.healthcareToken.assetCode,
          userToken.balance
        );
      } else {
        const member = await this.memberRepositoy.findOne({
          where: {
            patient: { id: userId },
            healthcareToken: { id: userToken.healthcareToken.id },
          },
          relations: ["agency"]
        });
        if (member) {
          let agencyKeypair = await this.findActiveKeypair(userId, member.agency.id)
          if(!agencyKeypair){
            agencyKeypair = await this.createKeypair(userId, pin, member.agency.id);
          }
          const agencyPrivateKey = await this.decryptPrivateKey(userId, pin, member.agency.id);
          await this.stellarService.changeTrust( agencyPrivateKey, userToken.healthcareToken.assetCode, userToken.healthcareToken.issuingPublicKey)
          const keypair = await this.findActiveKeypair(userId, member.agency.id);
          await axios.post(member.notifiedUrl, {
            nationalId: user.patient.nationalId,
            service: userToken.healthcareToken,
            balance: userToken.balance,
            publicKey: keypair.publicKey,
          });
          member.transferred = false;
          await this.memberRepositoy.save(member);
        }
        userToken.balance = 0;
      }
    };
    await this.userTokenRepository.save(userTokens);
    const { patient } = user;
    patient.requiredRecovery = false;
    await this.patientRepository.save(patient);
  }

  async validatePin(userId: number, pin: string): Promise<boolean> {
    const keypair = await this.findActiveKeypair(userId);
    if (!keypair) {
      throw new BadRequestException("There is no active keypair");
    }
    if (!compareSync(pin, keypair.hashPin)) {
      throw new BadRequestException("Invalid PIN");
    }
    return true;
  }

  async findActiveKeypair(userId: number, agencyId?: number): Promise<Keypair> {
    let query = this.keypairRepository
      .createQueryBuilder("keypair")
      .leftJoinAndSelect("keypair.users", "user")
      .leftJoinAndSelect("keypair.agency", "agency")
      .andWhere("keypair.is_active = true")
      .andWhere("user.id = :user_id", { user_id: userId });
    if (agencyId) {
      query.andWhere("agency.id = :agency_id", { agency_id: agencyId });
    } else {
      query.andWhere("agency.id IS NULL");
    }
    return query.getOne();
  }

  async findAllActiveKeypair(userId: number): Promise<Keypair[]> {
    let query = this.keypairRepository
      .createQueryBuilder("keypair")
      .leftJoinAndSelect("keypair.users", "user")
      .andWhere("keypair.is_active = true")
      .andWhere("user.id = :user_id", { user_id: userId });
    return query.getMany();
  }
}
