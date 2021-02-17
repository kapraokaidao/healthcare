import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import { KeypairModule } from "src/keypair/keypair.module";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, HealthcareToken]), KeypairModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
