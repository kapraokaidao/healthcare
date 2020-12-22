import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { Repository } from "typeorm";
import { createKeypairDto } from "./keypair.dto";
import { AES, SHA256 } from "crypto-js";
import {genSaltSync, hashSync} from "bcryptjs";
import { User } from "src/entities/user.entity";

@Injectable()
export class KeypairService {

  private readonly stellarFundingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stellarService: StellarService,
    private readonly configService: ConfigService
  ) {
    this.stellarFundingSecret = this.configService.get<string>("stellar.receivingSecret");
  }

  async createKeypair(userId: number, dto: createKeypairDto): Promise<Keypair>{
      const user = await this.userRepository.findOneOrFail(userId, {relations: ["patient"]});
      const [activeKeypairs, activeKeypairsCount] = await this.keypairRepository.findAndCount({
        where: [
          {user: user, isActive: true}
        ]
      }); 
      // is keypair existed
      if(activeKeypairsCount > 0){
        throw new BadRequestException("Keypair is already existed");
      }
      // len == 6 and only number
      if (!/^\d{6}$/.test(dto.pin)) {
        throw new BadRequestException("PIN must be 6 digits");
      }
      // gen new key pair
      // const keypair = await this.stellarService.createAccount(this.stellarFundingSecret, 2);
      let keypair: {privateKey: string, publicKey: string} = {privateKey: "xxasde", publicKey:"123"};


      const salt = genSaltSync(10);
      const encryptKey = hashSync(SHA256(user.patient.nationalId) + dto.pin, salt);
      const encryptedPrivateKey = AES.encrypt(keypair.privateKey, encryptKey).toString();

      // create account merge transaction and save XDR
      // hash pin
      const hashPin = hashSync(dto.pin);
      // save in db
      const newKeypair = new Keypair();
      newKeypair.encryptedPrivateKey = encryptedPrivateKey;
      newKeypair.salt = salt;
      newKeypair.publicKey = keypair.publicKey;
      newKeypair.hashPin = hashPin;
      newKeypair.user = user;

      return this.keypairRepository.save(newKeypair);
  }
}
