import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { Transaction } from "src/entities/transaction.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareToken } from "src/entities/healthcare-token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, HealthcareToken])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
