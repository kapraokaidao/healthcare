import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { Repository } from "typeorm";
import { createKeypairDto } from "./keypair.dto";

@Injectable()
export class KeypairService {

  private readonly stellarFundingSecret;

  constructor(
    @InjectRepository(Keypair)
    private readonly keypairRepository: Repository<Keypair>,
    private readonly stellarService: StellarService,
    private readonly configService: ConfigService
  ) {
    this.stellarFundingSecret = this.configService.get<string>("stellar.receivingSecret");
  }

  async createKeypair(userId: number, dto: createKeypairDto): Promise<Keypair>{
      // is keypair existed
      // len == 6 and only number
      if (!/^\d{6}$/.test(dto.pin)) {
        throw new BadRequestException("PIN must be 6 digits");
      }
      // gen new key pair
      const keypair = await this.stellarService.createAccount(this.stellarFundingSecret, 2);
      // create account merge transaction and save XDR
      // encrypt
      // save in db
      console.log(dto.pin);
      return this.keypairRepository.findOne(2);
  }
}
