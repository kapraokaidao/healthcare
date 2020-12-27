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
import { UserRole } from "src/constant/enum/user.enum";

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
    let user = await this.userRepository.findOneOrFail(userId);
    const [, activeKeypairsCount] = await this.keypairRepository.findAndCount({
      where: [{ user: user, isActive: true }],
    });
    if (activeKeypairsCount > 0) {
      throw new BadRequestException("Keypair is already existed");
    }
    if (!/^\d{6}$/.test(dto.pin)) {
      throw new BadRequestException("PIN must be 6 digits");
    }

    let userSalt: string;
    if (user.role === UserRole.Hospital) {
      user = await this.userRepository.findOne(userId, { relations: ["hospital"] });
      userSalt = user.hospital.code9;
    } else if (user.role === UserRole.Patient) {
      user = await this.userRepository.findOne(userId, { relations: ["patient"] });
      userSalt = user.patient.nationalId;
    } else {
      throw new BadRequestException("This user role can't create keypair");
    }

    const keypair = await this.stellarService.createAccount(
      this.stellarReceivingSecret,
      2
    );
    const salt = genSaltSync(10);
    const encryptKey = hashSync(SHA256(userSalt) + dto.pin, salt);
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

    let user = await this.userRepository.findOneOrFail(userId);
    let userSalt: string;
    switch (user.role) {
      case UserRole.Hospital:
        user = await this.userRepository.findOne(userId, { relations: ["hospital"] });
        userSalt = user.hospital.code9;
      case UserRole.Patient:
        user = await this.userRepository.findOne(userId, { relations: ["patient"] });
        userSalt = user.patient.nationalId;
    }

    const keypair = await this.keypairRepository.findOneOrFail({
      where: [{ user: user, isActive: true }],
    });
    const [salt, encryptedPrivateKey] = keypair.encryptedPrivateKey.split("$$$");
    const encryptKey = hashSync(SHA256(userSalt) + pin, salt);
    const privateKey = AES.decrypt(encryptedPrivateKey, encryptKey).toString(enc.Utf8);
    if (!privateKey) {
      throw new BadRequestException("Invalid PIN");
    }
    return privateKey;
  }

  async findActiveKeypair(userId: number): Promise<Keypair> {
    const keypair = await this.keypairRepository.findOneOrFail({
      where: {
        user: { id: userId },
        isActive: true,
      },
      select: ["isActive", "publicKey"],
    });
    return keypair;
  }
}
