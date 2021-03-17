import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillDetail } from "src/entities/bill-detail.entity";
import { Bill } from "src/entities/bill.entity";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import { UserToken } from "src/entities/user-token.entity";
import { HealthcareTokenModule } from "src/healthcare-token/healthcare-token.module";
import { KeypairModule } from "src/keypair/keypair.module";
import { BillController } from "./bill.controller";
import { BillService } from "./bill.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillDetail, UserToken, Transaction]),
    HealthcareTokenModule,
    KeypairModule,
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
