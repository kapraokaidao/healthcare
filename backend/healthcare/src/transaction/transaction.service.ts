import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as dayjs from "dayjs";
import { TransactionType } from "src/constant/enum/transaction.enum";
import { Transaction } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { Pagination, PaginationOptions, toPagination } from "src/utils/pagination.util";
import { Brackets, LessThan } from "typeorm";
import { TransactionSearchDto, TransactionSearchResponseDto } from "./transaction.dto";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository,
    @InjectRepository(User) private readonly userRepository
  ) {}

  async search(
    userId: number,
    dto: TransactionSearchDto
  ): Promise<Pagination<TransactionSearchResponseDto>> {
    let query = this.transactionRepository
      .createQueryBuilder("tx")
      .take(dto.pageSize)
      .skip((dto.page - 1) * dto.pageSize)
      .leftJoinAndSelect(
        "tx.healthcareToken",
        "healthcareToken",
        "healthcareToken.id = tx.healthcare_token_id",
        { userId: userId }
      )
      .addSelect("SUM(tx.amount) as amount")
      .groupBy("tx.healthcare_token_id");

    if (dto.startDate) {
      query.andWhere("CAST(tx.created_date as date) >= :startDate", {
        startDate: dto.startDate,
      });
    }
    if (dto.endDate) {
      query.andWhere("CAST(tx.created_date as date) <= :endDate", {
        endDate: dto.endDate,
      });
    }

    if (dto.type === TransactionType.Debit) {
      query.andWhere("tx.destination_user_id = :userId", {
        userId: userId,
      });
    } else if (dto.type === TransactionType.Credit) {
      query.andWhere("tx.source_user_id = :userId", {
        userId: userId,
      });
    } else {
      throw new BadRequestException("Invalid transaction type");
    }

    if (dto.name) {
      query.andWhere("healthcareToken.name like :name", {
        name: `%${dto.name}%`,
      });
    }

    const queryResult = await query.getRawMany();
    const transactons: TransactionSearchResponseDto[] = queryResult.map((e) => {
      const transaction: TransactionSearchResponseDto = {
        id: e.healthcareToken_id,
        name: e.healthcareToken_name,
        issuingPublicKey: e.healthcareToken_issuing_public_key,
        amount: e.amount,
      };
      return transaction;
    });
    return toPagination<TransactionSearchResponseDto>(transactons, transactons.length, {
      page: dto.page,
      pageSize: dto.pageSize,
    });
  }
}
