import { Module } from "@nestjs/common";
import { HealthcareTokenController } from "./healthcare-token.controller";
import { HealthcareTokenService } from "./healthcare-token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { StellarService } from "src/stellar/stellar.service";
import { UserToken } from "src/entities/user-token.entity";
import { TransferRequest } from "src/entities/transfer-request.entity";
import { KeypairModule } from "src/keypair/keypair.module";
import { TransactionModule } from "src/transaction/transaction.module";
import { AgencyModule } from "src/agency/agency.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthcareToken,
      UserToken,
      TransferRequest,
    ]),
    KeypairModule,
    TransactionModule,
    AgencyModule
  ],
  controllers: [HealthcareTokenController],
  providers: [HealthcareTokenService, StellarService],
})
export class HealthcareTokenModule {}
