import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { Repository } from "typeorm";
import { CreateKeypairDto, IsActiveResponseDto } from "./keypair.dto";
import { AES, enc, SHA256 } from "crypto-js";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import StellarSdk from "stellar-sdk";
import { UserRole } from "src/constant/enum/user.enum";
import { UserService } from "src/user/user.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class KeypairService {
  private readonly stellarReceivingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stellarService: StellarService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.stellarReceivingSecret = this.configService.get<string>(
      "stellar.receivingSecret"
    );
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

  async createKeypair(userId: number, pin: string, agencyId?: number): Promise<void> {
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
    await this.keypairRepository.save(newKeypair);
  }

  async addHospitalKeypair(userId: number,  hospitalUserId: number): Promise<void> {
    const hospital = await this.userService.findById(userId);
    const keypair = await this.findActiveKeypair(userId);
    hospital.keypairs = [...hospital.keypairs, keypair]
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
    const keypairs = await this.findAllActiveKeypair(userId)

    for (const keypair of keypairs) {
      const pk = await this.decryptPrivateKeyFromKeypair(userId, currentPin, keypair);
      const newEncryptedPrivateKey = await this.encryptPrivateKey(userId, newPin, pk);
      keypair.encryptedPrivateKey = newEncryptedPrivateKey;
      const newHashPin = hashSync(newPin);
      keypair.hashPin = newHashPin;
      await this.keypairRepository.save(keypair);
    }
  }

  async validatePin(userId: number, pin: string): Promise<boolean> {
    const keypair = await this.keypairRepository.findOne({
      where: { user: { id: userId }, isActive: true },
    });
    if (!keypair) {
      throw new BadRequestException("There is no active keypair");
    }
    if (!compareSync(pin, keypair.hashPin)) {
      throw new BadRequestException("Invalid PIN");
    }
    return true;
  }


  async findActiveKeypair(userId: number, agencyId?: number): Promise<Keypair> {
    let query = this.keypairRepository.createQueryBuilder("keypair")
    .leftJoinAndSelect("keypair.users", "user")
    .leftJoinAndSelect("keypair.agency", "agency")
    .andWhere("keypair.is_active = true")
    .andWhere("user.id = :user_id", { user_id: userId })
    if(agencyId) {
      query.andWhere("agency.id = :agency_id", {agency_id: agencyId})
    }
    else{
      query.andWhere("agency.id IS NULL")
    }
    return query.getOne()
  }

  async findAllActiveKeypair(userId: number): Promise<Keypair[]> {
    let query = this.keypairRepository.createQueryBuilder("keypair")
    .leftJoinAndSelect("keypair.users", "user")
    .andWhere("keypair.is_active = true")
    .andWhere("user.id = :user_id", { user_id: userId })
    return query.getMany()
  }
}
