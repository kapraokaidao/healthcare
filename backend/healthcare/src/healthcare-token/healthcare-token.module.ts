import { Module } from "@nestjs/common";
import { HealthcareTokenController } from "./healthcare-token.controller";
import { HealthcareTokenService } from "./healthcare-token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { StellarService } from "src/stellar/stellar.service";
import { User } from "src/entities/user.entity";
import { KeypairService } from "src/keypair/keypair.service";
import { Keypair } from "src/entities/keypair.entity";
import { UserToken } from "src/entities/user-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import { TransferRequest } from "src/entities/transfer-request.entity";
import { TransactionService } from "src/transaction/transaction.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthcareToken,
      User,
      Keypair,
      UserToken,
      TransferRequest,
      Transaction,
    ]),
  ],
  controllers: [HealthcareTokenController],
  providers: [HealthcareTokenService, StellarService, KeypairService, TransactionService],
})
export class HealthcareTokenModule {}
