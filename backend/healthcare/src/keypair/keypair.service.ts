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

@Injectable()
export class KeypairService {
  private readonly stellarReceivingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
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
    if (user.role === UserRole.Hospital) {
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
    const existedKeypair = await this.keypairRepository.findOne({
      where: [{ user: { id: userId }, isActive: true, agency: { id: agencyId } }],
    });
    if (existedKeypair) {
      throw new BadRequestException("Keypair is already existed");
    }
    if (!/^\d{6}$/.test(pin)) {
      throw new BadRequestException("PIN must be 6 digits");
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
    newKeypair.user = user;
    newKeypair.accountMergeXdr = accontMergeXdr;
    newKeypair.agency = agencyId ? await this.userService.findById(agencyId) : null;
    await this.keypairRepository.save(newKeypair);
  }

  async decryptPrivateKeyFromKeypair(
    userId: number,
    pin: string,
    keypair: Keypair
  ): Promise<string> {
    if (!/^\d{6}$/.test(pin)) {
      throw new BadRequestException("PIN must be 6 digits");
    }

    const user = await this.userService.findById(userId, true);
    let userSalt: string;
    if (user.role === UserRole.Hospital) {
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
    if (!/^\d{6}$/.test(pin)) {
      throw new BadRequestException("PIN must be 6 digits");
    }

    const keypair = await this.keypairRepository.findOneOrFail({
      where: [
        {
          user: { id: userId },
          isActive: true,
          agency: { id: agencyId ? agencyId : null },
        },
      ],
    });

    const privateKey = await this.decryptPrivateKeyFromKeypair(userId, pin, keypair);

    return privateKey;
  }

  async findPublicKey(userId: number, agencyId?: number): Promise<string> {
    const keypair = await this.keypairRepository.findOneOrFail({
      where: {
        user: { id: userId },
        isActive: true,
        agency: { id: agencyId ? agencyId : null },
      },
    });
    return keypair.publicKey;
  }

  async isActive(userId: number, agencyId?: number): Promise<IsActiveResponseDto> {
    const keypair = await this.keypairRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
        agency: { id: agencyId ? agencyId : null },
      },
    });
    return { isActive: !!keypair };
  }

  async changePin(userId: number, currentPin: string, newPin: string): Promise<void> {
    const keypairs = await this.keypairRepository.find({
      where: {
        user: { id: userId },
        isActive: true,
      },
    });

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
}
