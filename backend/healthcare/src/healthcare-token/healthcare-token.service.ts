import { BadRequestException, Injectable } from "@nestjs/common";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { HealthcareTokenDto, ReceiveTokenDto } from "./healthcare-token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, Repository } from "typeorm";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import * as dayjs from "dayjs";
import { StellarService } from "src/stellar/stellar.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/entities/user.entity";
import { KeypairService } from "src/keypair/keypair.service";
import { UserToken } from "src/entities/user-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import StellarSdk from "stellar-sdk";

@Injectable()
export class HealthcareTokenService {
  private readonly stellarIssuingSecret;
  private readonly stellarReceivingSecret;

  constructor(
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly stellarService: StellarService,
    private readonly keypairService: KeypairService,
    private readonly configService: ConfigService,
    private connection: Connection
  ) {
    this.stellarIssuingSecret = this.configService.get<string>("stellar.issuingSecret");
    this.stellarReceivingSecret = this.configService.get<string>(
      "stellar.receivingSecret"
    );
  }

  async find(
    conditions,
    pageOptions: PaginationOptions
  ): Promise<Pagination<HealthcareToken>> {
    const [tokens, totalCount] = await this.healthcareTokenRepository.findAndCount({
      where: {
        ...conditions,
      },
      take: pageOptions.pageSize,
      skip: (pageOptions.page - 1) * pageOptions.pageSize,
    });
    return toPagination<HealthcareToken>(tokens, totalCount, pageOptions);
  }

  async createToken(dto: HealthcareTokenDto): Promise<HealthcareToken> {
    const existedToken = await this.healthcareTokenRepository.findOne({ name: dto.name });
    if (existedToken) {
      throw new BadRequestException(`Token name '${dto.name} is already existed'`);
    }
    if (dto.startAge > dto.endAge) {
      throw new BadRequestException("startAge cannot be greater than endAge");
    }
    const startDate = dayjs(dto.startDate);
    const endDate = dayjs(dto.endDate);
    if (endDate.isBefore(startDate)) {
      throw new BadRequestException("endDate cannot be before startDate");
    }
    const public_keys = await this.stellarService.issueToken(
      this.stellarIssuingSecret,
      this.stellarReceivingSecret,
      dto.name,
      dto.totalToken
    );
    const newToken = await this.healthcareTokenRepository.create({
      ...dto,
      ...public_keys,
    });
    newToken.remainingToken = dto.totalToken;
    return this.healthcareTokenRepository.save(newToken);
  }

  async deactivateToken(id: number): Promise<HealthcareToken> {
    const token = await this.healthcareTokenRepository.findOne(id);
    if (!token) {
      throw new BadRequestException(`Token id '${id} is not found'`);
    }
    token.isActive = false;
    return this.healthcareTokenRepository.save(token);
  }

  async findValidTokens(
    userId: number,
    pageOptions: PaginationOptions,
    serviceId?: number
  ): Promise<Pagination<HealthcareToken>> {
    const user = await this.userRepository.findOne(userId, { relations: ["patient"] });
    const now = dayjs();
    const userAge = now.diff(user.patient.birthDate, "year");
    const today = now.format("YYYY-MM-DD");

    let query = this.healthcareTokenRepository
      .createQueryBuilder("healthcare_token")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize)
      .where(
        new Brackets((qb) => {
          qb.where("healthcare_token.start_age <= :userAge", {
            userAge: userAge,
          }).orWhere("healthcare_token.start_age IS NULL");
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("healthcare_token.end_age >= :userAge", { userAge: userAge }).orWhere(
            "healthcare_token.end_age IS NULL"
          );
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("healthcare_token.gender = :userGender", {
            userGender: user.patient.gender,
          }).orWhere("healthcare_token.gender IS NULL");
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("healthcare_token.start_date <= :today", { today: today }).orWhere(
            "healthcare_token.start_date IS NULL"
          );
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("healthcare_token.end_date >= :today", { today: today }).orWhere(
            "healthcare_token.end_date IS NULL"
          );
        })
      )
      .andWhere("healthcare_token.is_active = 1")
      .leftJoinAndSelect(
        "healthcare_token.userTokens",
        "user_token",
        "user_token.user_id = :userId",
        { userId: userId }
      );

    if (serviceId) {
      query.andWhere("healthcare_token.id = :serviceId", { serviceId: serviceId });
    }

    const [tokens, totalCount] = await query.getManyAndCount();
    return toPagination<HealthcareToken>(tokens, totalCount, pageOptions);
  }

  async receiveToken(userId: number, dto: ReceiveTokenDto): Promise<void> {
    const user = await this.userRepository.findOneOrFail(userId);
    const { data, totalCount } = await this.findValidTokens(
      userId,
      { page: 0, pageSize: 0 },
      dto.serviceId
    );
    if (totalCount === 0) {
      throw new BadRequestException("This service is not available for this user.");
    }
    if (data[0].userTokens.length > 0) {
      throw new BadRequestException("This service was received before");
    }
    const privateKey = await this.keypairService.decryptPrivateKey(userId, dto.pin);
    if (!privateKey) {
      throw new BadRequestException("Invalid PIN");
    }
    const newUserToken = this.userTokenRepository.create();
    newUserToken.balance = data[0].tokenPerPerson;
    newUserToken.user = user;
    newUserToken.healthcareToken = data[0];

    const newTransaction = this.transactionRepository.create();
    newTransaction.amount = data[0].tokenPerPerson;
    newTransaction.destinationPublicKey = StellarSdk.Keypair.fromSecret(privateKey).publicKey();
    newTransaction.destinationUser = user;
    newTransaction.healthcareToken = data[0];
    newTransaction.sourcePublicKey = StellarSdk.Keypair.fromSecret(this.stellarReceivingSecret).publicKey();

    await this.connection.transaction(async (manager) => {
      await manager.save(newUserToken);
      await manager.save(newTransaction);
      await this.stellarService.allowTrustAndTransferToken(
        this.stellarReceivingSecret,
        privateKey,
        data[0].name,
        data[0].issuingPublicKey,
        data[0].tokenPerPerson
      );
    });

    //Todo: update XDR
  }
}
