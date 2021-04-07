import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TxType } from "src/constant/enum/transaction.enum";
import { UserRole } from "src/constant/enum/user.enum";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import { KeypairService } from "src/keypair/keypair.service";
import { UserService } from "src/user/user.service";
import { Pagination, PaginationOptions, toPagination } from "src/utils/pagination.util";
import { EntityManager, Repository } from "typeorm";
import {
  SearchTransactionNHSODto,
  SearchTransactionNHSOResponse,
  TransactionSearchDto,
  TransactionSearchResponseDto,
} from "./transaction.dto";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>,
    private readonly keypairService: KeypairService,
    private readonly userService: UserService
  ) {}

  async create(
    sourceUserId: number,
    sourcePublicKey: string,
    destinationUserId: number,
    destinationPublicKey: string,
    serviceId: number,
    amount: number,
    type: TxType,
    manager?: EntityManager
  ): Promise<Transaction> {
    const newTransaction = new Transaction();
    newTransaction.amount = amount;
    newTransaction.destinationPublicKey = destinationPublicKey;
    newTransaction.destinationUser = destinationUserId
      ? await this.userService.findById(destinationUserId)
      : null;
    newTransaction.healthcareToken = await this.healthcareTokenRepository.findOne(
      serviceId
    );
    newTransaction.sourcePublicKey = sourcePublicKey;
    newTransaction.sourceUser = sourceUserId
      ? await this.userService.findById(sourceUserId)
      : null;
    newTransaction.type = type;

    if (type === TxType.Redeem) {
      newTransaction.outstanding = amount;
    }

    return manager
      ? manager.save(newTransaction)
      : this.transactionRepository.save(newTransaction);
  }

  async findTokens(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { sourceUser: { id: userId } },
      relations: ["healthcareToken", "destinationUser", "destinationUser.hospital"],
    });
  }

  async searchGroupByService(
    userId: number,
    dto: TransactionSearchDto
  ): Promise<TransactionSearchResponseDto[]> {
    const query = this.transactionRepository
      .createQueryBuilder("tx")
      .leftJoinAndSelect(
        "tx.healthcareToken",
        "healthcareToken",
        "healthcareToken.id = tx.healthcare_token_id"
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

    if (dto.type === TxType.Redeem) {
      const publicKey = await this.keypairService.findPublicKey(userId);
      query.andWhere("tx.destination_public_key = :publicKey", {
        publicKey,
      });
    } else if (dto.type === TxType.Provide) {
      query.andWhere("tx.type = :txType", {
        txType: TxType.Provide,
      });
      const publicKey = await this.keypairService.findPublicKey(userId);
      query.andWhere("tx.source_public_key = :publicKey", {
        publicKey,
      });
    } else if (dto.type === TxType.Withdraw) {
      query.andWhere("tx.type = :txType", {
        txType: TxType.Withdraw,
      });
      const publicKey = await this.keypairService.findPublicKey(userId);
      query.andWhere("tx.source_public_key = :publicKey", {
        publicKey,
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

    const transactions: TransactionSearchResponseDto[] = queryResult.map((e) => {
      const transaction: TransactionSearchResponseDto = {
        id: e.healthcareToken_id,
        name: e.healthcareToken_name,
        amount: e.amount,
      };
      return transaction;
    });
    return transactions;
  }

  async searchHistory(
    userId: number,
    dto: TransactionSearchDto,
    pageOptions: PaginationOptions
  ): Promise<Pagination<any>> {
    let query = this.transactionRepository
      .createQueryBuilder("tx")
      .leftJoinAndSelect(
        "tx.healthcareToken",
        "healthcareToken",
        "healthcareToken.id = tx.healthcare_token_id"
      )
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize)
      .orderBy("tx.createdDate", "DESC");

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

    if (dto.type === TxType.Redeem) {
      query.leftJoinAndSelect("tx.sourceUser", "user", "user.id = tx.source_user_id");
      const { role } = await this.userService.findById(userId, false);
      if (role === UserRole.HospitalAdmin) {
        const publicKey = await this.keypairService.findPublicKey(userId);
        query.andWhere("tx.destination_public_key = :publicKey", {
          publicKey,
        });
      } else {
        query.andWhere("tx.destination_user_id = :userId", {
          userId,
        });
      }
    } else if (dto.type === TxType.Provide) {
      query.leftJoinAndSelect(
        "tx.destinationUser",
        "user",
        "user.id = tx.destination_user_id"
      );
      query.andWhere("tx.type = :txType", {
        txType: TxType.Provide,
      });
      const { role } = await this.userService.findById(userId, false);
      if (role === UserRole.HospitalAdmin) {
        const publicKey = await this.keypairService.findPublicKey(userId);
        query.andWhere("tx.source_public_key = :publicKey", {
          publicKey,
        });
      } else {
        query.andWhere("tx.source_user_id = :userId", {
          userId,
        });
      }
    } else if (dto.type === TxType.Withdraw) {
      query.leftJoinAndSelect(
        "tx.destinationUser",
        "user",
        "user.id = tx.destination_user_id"
      );
      query.andWhere("tx.type = :txType", {
        txType: TxType.Withdraw,
      });
      const { role } = await this.userService.findById(userId, false);
      if (role === UserRole.HospitalAdmin) {
        const publicKey = await this.keypairService.findPublicKey(userId);
        query.andWhere("tx.source_public_key = :publicKey", {
          publicKey,
        });
      } else {
        query.andWhere("tx.source_user_id = :userId", {
          userId,
        });
      }
    } else {
      throw new BadRequestException("Invalid transaction type");
    }

    const [history, totalCount] = await query.getManyAndCount();
    return toPagination<any>(history, totalCount, pageOptions);
  }

  async searchTransactionNHSO(
    dto: SearchTransactionNHSODto
  ): Promise<Pagination<SearchTransactionNHSOResponse>> {
    let query = this.transactionRepository
      .createQueryBuilder("tx")
      .leftJoinAndSelect(
        "tx.healthcareToken",
        "healthcareToken",
        "healthcareToken.id = tx.healthcare_token_id"
      )
      .leftJoinAndSelect(
        "tx.destinationUser",
        "destinationUser",
        "tx.destination_user_id  = destinationUser.id"
      )
      .leftJoinAndSelect(
        "destinationUser.hospital",
        "hospital",
        "hospital.code9 = destinationUser.hospital_code9"
      )
      .leftJoinAndSelect(
        "tx.sourceUser",
        "sourceUser",
        "tx.source_user_id  = sourceUser.id"
      )
      .take(dto.pageSize)
      .skip((dto.page - 1) * dto.pageSize)
      .orderBy("tx.createdDate", "DESC")
      .andWhere("tx.type = :txType", {
        txType: TxType.Redeem,
      });

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
    if (dto.serviceName) {
      query.andWhere("healthcareToken.name like :name", {
        name: `%${dto.serviceName}%`,
      });
    }
    if (dto.hospitalCode) {
      query.andWhere("hospital.code9 = :hospitalCode", {
        hospitalCode: dto.hospitalCode,
      });
    }
    if (dto.firstname) {
      query.andWhere("sourceUser.firstname like :firstname", {
        firstname: `%${dto.firstname}%`,
      });
    }
    if (dto.lastname) {
      query.andWhere("sourceUser.lastname like :lastname", {
        lastname: `%${dto.lastname}%`,
      });
    }

    const [queryResult, totalCount] = await query.getManyAndCount();

    const response = [];

    queryResult.forEach((tx) => {
      const e = new SearchTransactionNHSOResponse();
      e.id = tx.id;
      e.amount = tx.amount;
      e.createdDate = tx.createdDate;
      e.firstname = tx.sourceUser.firstname;
      e.lastname = tx.sourceUser.lastname;
      e.hospitalName = tx.destinationUser.hospital.fullname;
      e.serviceName = tx.healthcareToken.name;
      response.push(e);
    });

    return toPagination<SearchTransactionNHSOResponse>(response, totalCount, {
      page: dto.page,
      pageSize: dto.pageSize,
    });
  }
}
