import { BadRequestException, Injectable } from "@nestjs/common";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { HealthcareTokenDto } from "./healthcare-token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, MoreThan, Repository } from "typeorm";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import * as dayjs from "dayjs";
import { StellarService } from "src/stellar/stellar.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/entities/user.entity";
import { KeypairService } from "src/keypair/keypair.service";
import { UserToken } from "src/entities/user-token.entity";
import { Transaction } from "src/entities/transaction.entity";
import StellarSdk from "stellar-sdk";
import { TransferRequest } from "src/entities/transfer-request.entity";
import { UserRole } from "src/constant/enum/user.enum";
import { TokenType, TransferRequestType } from "src/constant/enum/token.enum";

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
    @InjectRepository(TransferRequest)
    private readonly transferRequestRepository: Repository<TransferRequest>,
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

  async createToken(userId: number, dto: HealthcareTokenDto): Promise<HealthcareToken> {
    const user = await this.userRepository.findOneOrFail(userId);
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
    newToken.createdBy = user;
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

  async findValidSpecialTokens(
    userId: number,
  ): Promise<HealthcareToken[]> {
    const user = await this.userRepository.findOne(userId, { relations: ["patient"] });
    const now = dayjs();
    const userAge = now.diff(user.patient.birthDate, "year");
    const today = now.format("YYYY-MM-DD");

    let query = this.healthcareTokenRepository
      .createQueryBuilder("healthcare_token")
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
      .andWhere("healthcare_token.token_type = :tokenType", { tokenType: TokenType.Special })
      .andWhere("healthcare_token.is_active = 1")
      .leftJoinAndSelect(
        "healthcare_token.userTokens",
        "user_token",
        "user_token.user_id = :userId",
        { userId: userId }
      )
      .andWhere("user_token.id IS NULL")

    const tokens = await query.getMany();
    return tokens;
  }

  async receiveToken(userId: number, serviceId: number, pin: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail(userId);
    const { data, totalCount } = await this.findValidTokens(
      userId,
      { page: 0, pageSize: 0 },
      serviceId
    );
    if (totalCount === 0) {
      throw new BadRequestException("This service is not available for this user");
    }
    if (data[0].userTokens.length > 0) {
      throw new BadRequestException("This service was received before");
    }
    if (data[0].remainingToken < data[0].tokenPerPerson) {
      throw new BadRequestException("Remaining token is not enough");
    }

    const privateKey = await this.keypairService.decryptPrivateKey(userId, pin);

    const newUserToken = this.userTokenRepository.create();
    newUserToken.balance = data[0].tokenPerPerson;
    newUserToken.user = user;
    newUserToken.healthcareToken = data[0];
    newUserToken.isTrusted = true;
    newUserToken.isReceived = true;

    const newTransaction = this.transactionRepository.create();
    newTransaction.amount = data[0].tokenPerPerson;
    newTransaction.destinationPublicKey = StellarSdk.Keypair.fromSecret(
      privateKey
    ).publicKey();
    newTransaction.destinationUser = user;
    newTransaction.healthcareToken = data[0];
    newTransaction.sourcePublicKey = StellarSdk.Keypair.fromSecret(
      this.stellarReceivingSecret
    ).publicKey();

    await this.connection.transaction(async (manager) => {
      await manager.save(newUserToken);
      await manager.save(newTransaction);
      await manager.decrement(
        HealthcareToken,
        { id: data[0].id },
        "remainingToken",
        data[0].tokenPerPerson
      );
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

  async getVerificationInfo(userId: number, serviceId: number): Promise<UserToken> {
    let userToken = await this.userTokenRepository.findOne(
      { user: { id: userId }, healthcareToken: { id: serviceId } },
      { relations: ["user", "healthcareToken", "user.patient"] }
    );
    if (!userToken) {
      throw new BadRequestException("This service is not available for this user");
    }
    if(userToken.balance <= 0) {
      throw new BadRequestException(`${userToken.healthcareToken.name} is exceeded the redemption limit`);
    }
    if(!userToken.healthcareToken.isActive){
      throw new BadRequestException(`${userToken.healthcareToken.name} was alredy deactivated`);
    }
    if(dayjs().isAfter(dayjs(userToken.healthcareToken.endDate), 'day')){
      throw new BadRequestException(`${userToken.healthcareToken.name} is expired`);
    }
    return userToken;
  }

  async createRedeemRequest(
    userId: number,
    patientId: number,
    serviceId: number,
    amount: number,
    pin: string
  ): Promise<TransferRequest> {
    await this.keypairService.validatePin(userId, pin);
    const hospital = await this.userRepository.findOneOrFail({
      where: { id: userId, role: UserRole.Hospital },
    });
    const userToken = await this.userTokenRepository.findOne({
      where: { user: { id: userId }, healthcareToken: { id: serviceId } },
    });
    if (!userToken || userToken.isTrusted === false) {
      await this.addTrustline(userId, serviceId, pin);
    }
    const existedTransferRequest = await this.transferRequestRepository.findOne({
      where: {
        patient: { id: patientId },
        healthcareToken: { id: serviceId },
        expiredDate: MoreThan(dayjs().toDate()),
        isConfirmed: false,
        type: TransferRequestType.Redemption,
      },
    });
    if (existedTransferRequest) {
      throw new BadRequestException("Redeem request was already created");
    }

    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const patient = await this.userRepository.findOneOrFail(patientId);
    const newTransferRequest = this.transferRequestRepository.create();
    newTransferRequest.amount = amount;
    newTransferRequest.expiredDate = dayjs().add(10, "minute").toDate();
    newTransferRequest.healthcareToken = healthcareToken;
    newTransferRequest.isConfirmed = false;
    newTransferRequest.hospital = hospital;
    newTransferRequest.patient = patient;
    newTransferRequest.amount = amount;
    newTransferRequest.type = TransferRequestType.Redemption;
    return this.transferRequestRepository.save(newTransferRequest);
  }

  async createSpecialTokenRequest(
    userId: number,
    patientId: number,
    serviceId: number,
    pin: string
  ): Promise<TransferRequest> {
    await this.keypairService.validatePin(userId, pin);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    if (healthcareToken.tokenType !== TokenType.Special) {
      throw new BadRequestException(
        `${healthcareToken.name} is not a special token type`
      );
    }
    const hospital = await this.userRepository.findOneOrFail({
      where: { id: userId, role: UserRole.Hospital },
    });
    const existedTransferRequest = await this.transferRequestRepository.findOne({
      where: {
        patient: { id: patientId },
        healthcareToken: { id: serviceId },
        expiredDate: MoreThan(dayjs().toDate()),
        isConfirmed: false,
        type: TransferRequestType.SpecialToken,
      },
    });
    if (existedTransferRequest) {
      throw new BadRequestException("Special token request was already created");
    }

    const patient = await this.userRepository.findOneOrFail(patientId);
    const newTransferRequest = this.transferRequestRepository.create();
    newTransferRequest.expiredDate = dayjs().add(10, "minute").toDate();
    newTransferRequest.healthcareToken = healthcareToken;
    newTransferRequest.isConfirmed = false;
    newTransferRequest.hospital = hospital;
    newTransferRequest.patient = patient;
    newTransferRequest.amount = healthcareToken.tokenPerPerson;
    newTransferRequest.type = TransferRequestType.SpecialToken;
    return this.transferRequestRepository.save(newTransferRequest);
  }

  async redeemToken(userId: number, serviceId: number, pin: string) {
    const existedTransferRequest = await this.transferRequestRepository.findOne({
      where: {
        patient: { id: userId },
        healthcareToken: { id: serviceId },
        expiredDate: MoreThan(dayjs().toDate()),
        isConfirmed: false,
        type: TransferRequestType.Redemption,
      },
      relations: ["hospital", "healthcareToken", "patient"],
    });
    if (!existedTransferRequest) {
      throw new BadRequestException("There is no redeem request from hospital");
    }
    await this.transferToken(
      userId,
      existedTransferRequest.hospital.id,
      serviceId,
      existedTransferRequest.amount,
      pin
    );
    existedTransferRequest.isConfirmed = true;
    await this.transferRequestRepository.save(existedTransferRequest);
  }

  async receiveSpecialToken(userId: number, serviceId: number, pin: string) {
    const existedTransferRequest = await this.transferRequestRepository.findOne({
      where: {
        patient: { id: userId },
        healthcareToken: { id: serviceId },
        expiredDate: MoreThan(dayjs().toDate()),
        isConfirmed: false,
        type: TransferRequestType.SpecialToken,
      },
      relations: ["hospital", "healthcareToken", "patient"],
    });
    if (!existedTransferRequest) {
      throw new BadRequestException("There is no special token request from hospital");
    }
    await this.receiveToken(userId, serviceId, pin);
    existedTransferRequest.isConfirmed = true;
    await this.transferRequestRepository.save(existedTransferRequest);
  }

  async addTrustline(userId: number, serviceId: number, pin: string) {
    const user = await this.userRepository.findOneOrFail(userId);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const privateKey = await this.keypairService.decryptPrivateKey(userId, pin);
    const newUserToken = this.userTokenRepository.create();
    newUserToken.isTrusted = true;
    newUserToken.balance = 0;
    newUserToken.healthcareToken = healthcareToken;
    newUserToken.user = user;

    await this.connection.transaction(async (manager) => {
      await manager.save(newUserToken);
      await this.stellarService.changeTrust(
        privateKey,
        healthcareToken.name,
        healthcareToken.issuingPublicKey
      );
    });

    //Todo: update XDR
  }

  async transferToken(
    sourceUserId: number,
    destinationUserId: number,
    serviceId: number,
    amount: number,
    pin: string
  ) {
    const sourceUser = await this.userRepository.findOneOrFail(sourceUserId);
    const destinationUser = await this.userRepository.findOneOrFail(destinationUserId);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const sourceUserBalance = await this.userTokenRepository.findOneOrFail({
      where: { user: sourceUser, healthcareToken: healthcareToken },
    });
    const privateKey = await this.keypairService.decryptPrivateKey(sourceUserId, pin);
    const sourceKeypair = await this.keypairService.findActiveKeypair(sourceUserId);
    const destinationKeypair = await this.keypairService.findActiveKeypair(
      destinationUserId
    );
    const newTransaction = this.transactionRepository.create();

    if (amount <= 0) {
      throw new BadRequestException("Amount must be greater than 0");
    }

    if (amount > sourceUserBalance.balance) {
      throw new BadRequestException("Source account doesn't have enough tokens");
    }

    newTransaction.amount = amount;
    newTransaction.destinationPublicKey = destinationKeypair.publicKey;
    newTransaction.destinationUser = destinationUser;
    newTransaction.healthcareToken = healthcareToken;
    newTransaction.sourcePublicKey = sourceKeypair.publicKey;
    newTransaction.sourceUser = sourceUser;

    await this.connection.transaction(async (manager) => {
      await manager.save(newTransaction);
      await manager.decrement(
        UserToken,
        { user: { id: sourceUserId }, healthcareToken: { id: serviceId } },
        "balance",
        amount
      );
      await manager.increment(
        UserToken,
        { user: { id: destinationUserId }, healthcareToken: { id: serviceId } },
        "balance",
        amount
      );
      await this.stellarService.transferToken(
        privateKey,
        destinationKeypair.publicKey,
        healthcareToken.name,
        healthcareToken.issuingPublicKey,
        amount
      );
    });
    //Todo: update XDR
  }

  async getBalance(userId: number, pageOptions: PaginationOptions): Promise<Pagination<UserToken>>{
    const [userTokens, totalCount] = await this.userTokenRepository.findAndCount({
      where: {user: {id: userId}},
      relations: ["healthcareToken"],
      take: pageOptions.pageSize,
      skip: (pageOptions.page - 1) * pageOptions.pageSize
    }
    );
    return toPagination<UserToken>(userTokens, totalCount, pageOptions)
  }
}
