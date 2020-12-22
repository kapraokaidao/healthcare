import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { Repository } from "typeorm";
import { createKeypairDto } from "./keypair.dto";
import { AES, enc, SHA256 } from "crypto-js";
import { genSaltSync, hashSync } from "bcryptjs";
import { User } from "src/entities/user.entity";
import StellarSdk from "stellar-sdk";

@Injectable()
export class KeypairService {
  private readonly stellarReceivingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stellarService: StellarService,
    private readonly configService: ConfigService
  ) {
    this.stellarReceivingSecret = this.configService.get<string>(
      "stellar.receivingSecret"
    );
  }

  async createKeypair(userId: number, dto: createKeypairDto): Promise<Keypair> {
    const user = await this.userRepository.findOneOrFail(userId, {
      relations: ["patient"],
    });
    const [, activeKeypairsCount] = await this.keypairRepository.findAndCount({
      where: [{ user: user, isActive: true }],
    });
    if (activeKeypairsCount > 0) {
      throw new BadRequestException("Keypair is already existed");
    }
    if (!/^\d{6}$/.test(dto.pin)) {
      throw new BadRequestException("PIN must be 6 digits");
    }
    const keypair = await this.stellarService.createAccount(
      this.stellarReceivingSecret,
      2
    );
    const salt = genSaltSync(10);
    const encryptKey = hashSync(SHA256(user.patient.nationalId) + dto.pin, salt);
    const encryptedPrivateKey = AES.encrypt(keypair.privateKey, encryptKey).toString();

    const receivingKeys = StellarSdk.Keypair.fromSecret(this.stellarReceivingSecret);
    const accontMergeXdr = await this.stellarService.createAccountMergeXdr(
      keypair.privateKey,
      receivingKeys.publicKey()
    );

    const hashPin = hashSync(dto.pin);

    const newKeypair = new Keypair();
    newKeypair.encryptedPrivateKey = `${salt}$$$${encryptedPrivateKey}`;
    newKeypair.publicKey = keypair.publicKey;
    newKeypair.hashPin = hashPin;
    newKeypair.user = user;
    newKeypair.accountMergeXdr = accontMergeXdr;

    return this.keypairRepository.save(newKeypair);
  }

  async decryptPrivateKey(userId: number, pin: string): Promise<string> {
    if (!/^\d{6}$/.test(pin)) {
      throw new BadRequestException("PIN must be 6 digits");
    }
    const user = await this.userRepository.findOneOrFail(userId, {
      relations: ["patient"],
    });
    const keypair = await this.keypairRepository.findOneOrFail({
      where: [{ user: user, isActive: true }],
    });
    const [salt, encryptedPrivateKey] = keypair.encryptedPrivateKey.split("$$$");
    const encryptKey = hashSync(SHA256(user.patient.nationalId) + pin, salt);
    const privateKey = AES.decrypt(encryptedPrivateKey, encryptKey).toString(enc.Utf8);
    return privateKey;
  }
}
