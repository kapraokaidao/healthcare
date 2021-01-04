import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { Transaction } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
