import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { HealthcareTokenDto, Slip } from "./healthcare-token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, MoreThan, Repository, SelectQueryBuilder } from "typeorm";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import * as dayjs from "dayjs";
import { StellarService } from "src/stellar/stellar.service";
import { ConfigService } from "@nestjs/config";
import { KeypairService } from "src/keypair/keypair.service";
import { UserToken } from "src/entities/user-token.entity";
import StellarSdk from "stellar-sdk";
import { TransferRequest } from "src/entities/transfer-request.entity";
import { TokenType, TransferRequestType } from "src/constant/enum/token.enum";
import { TransactionService } from "src/transaction/transaction.service";
import { UserService } from "src/user/user.service";
import { User } from "src/entities/user.entity";
import { UserRole } from "src/constant/enum/user.enum";
import { AgencyService } from "src/agency/agency.service";

@Injectable()
export class HealthcareTokenService {
  private readonly stellarIssuingSecret;
  private readonly stellarReceivingSecret;

  constructor(
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(TransferRequest)
    private readonly transferRequestRepository: Repository<TransferRequest>,
    private readonly stellarService: StellarService,
    private readonly keypairService: KeypairService,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly agencyService: AgencyService,
    private readonly configService: ConfigService,
    private connection: Connection
  ) {
    this.stellarIssuingSecret = this.configService.get<string>("stellar.issuingSecret");
    this.stellarReceivingSecret = this.configService.get<string>(
      "stellar.receivingSecret"
    );
  }

  async findById(id: number): Promise<HealthcareToken> {
    return this.healthcareTokenRepository.findOneOrFail(id);
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
    const user = await this.userService.findById(userId);
    if (dto.startAge > dto.endAge) {
      throw new BadRequestException("startAge cannot be greater than endAge");
    }
    const startDate = dayjs(dto.startDate);
    const endDate = dayjs(dto.endDate);
    if (endDate.isBefore(startDate)) {
      throw new BadRequestException("endDate cannot be before startDate");
    }
    const assetCode = Math.floor(Date.now() / 10).toString();
    const publicKeys = await this.stellarService.issueToken(
      this.stellarIssuingSecret,
      this.stellarReceivingSecret,
      assetCode,
      dto.totalToken
    );
    const newToken = await this.healthcareTokenRepository.create({
      ...dto,
      ...publicKeys,
    });
    newToken.assetCode = assetCode;
    newToken.remainingToken = dto.totalToken;
    newToken.createdBy = user;
    return this.healthcareTokenRepository.save(newToken);
  }

  async getBalance(
    userId: number,
    pageOptions: PaginationOptions
  ): Promise<Pagination<UserToken>> {
    const user = await this.userService.findById(userId, true);
    let [userTokens, totalCount] = await this.userTokenRepository.findAndCount({
      where: { user: { id: userId }, balance: MoreThan(0) },
      relations: ["healthcareToken"],
      take: pageOptions.pageSize,
      skip: (pageOptions.page - 1) * pageOptions.pageSize,
    });
    if (user.role === UserRole.Patient) {
      userTokens = userTokens.filter((userToken) =>
        this.validateBasicRule(user, userToken.healthcareToken)
      );
      totalCount = userTokens.length;
    }
    return toPagination<UserToken>(userTokens, totalCount, pageOptions);
  }

  async getBalanceByServiceId(userId: number, serviceId: number): Promise<UserToken> {
    const query = this.userTokenRepository
      .createQueryBuilder("user_token")
      .where(
        "user_token.user_id = :userId AND user_token.healthcare_token_id = :serviceId",
        { userId: userId, serviceId: serviceId }
      )
      .leftJoinAndSelect("user_token.healthcareToken", "healthcare_token");
    return query.getOneOrFail();
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
    pageOptions: PaginationOptions
  ): Promise<Pagination<HealthcareToken>> {
    const user = await this.userService.findById(userId, true);

    let query = this.basicRulesQuery(user)
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize)
      .andWhere("healthcare_token.is_active = 1")
      .andWhere("healthcare_token.token_type = :tokenType", {
        tokenType: TokenType.General,
      })
      .leftJoinAndSelect(
        "healthcare_token.userTokens",
        "user_token",
        "user_token.user_id = :userId",
        { userId: userId }
      )
      .leftJoinAndSelect(
        "healthcare_token.members",
        "member",
        "member.patient_id = :userId",
        { userId: userId }
      )
      .leftJoinAndSelect("healthcare_token.createdBy", "created_by")
      .andWhere(
        new Brackets((qb) => {
          qb.where("created_by.role = :NHSO", {
            NHSO: UserRole.NHSO,
          }).orWhere("created_by.role = :AGENCY AND member.id IS NOT NULL", {
            AGENCY: UserRole.Agency,
          });
        })
      )
      .andWhere("user_token.id IS NULL");

    const [tokens, totalCount] = await query.getManyAndCount();
    return toPagination<HealthcareToken>(tokens, totalCount, pageOptions);
  }

  async findValidSpecialTokens(userId: number): Promise<HealthcareToken[]> {
    const user = await this.userService.findById(userId, true);

    let query = this.basicRulesQuery(user)
      .andWhere("healthcare_token.is_active = 1")
      .andWhere("healthcare_token.token_type = :tokenType", {
        tokenType: TokenType.Special,
      })
      .leftJoinAndSelect(
        "healthcare_token.userTokens",
        "user_token",
        "user_token.user_id = :userId",
        { userId: userId }
      )
      .andWhere("user_token.id IS NULL");

    const tokens = await query.getMany();
    return tokens;
  }

  async receiveToken(userId: number, serviceId: number, pin: string): Promise<void> {
    const validGeneralTokens = await this.findValidTokens(userId, {
      page: 0,
      pageSize: 0,
    });
    if (
      validGeneralTokens.data.findIndex(
        (validGeneralToken) => validGeneralToken.id === serviceId
      ) === -1
    ) {
      throw new BadRequestException("This service is not valid for this user");
    }
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(
      serviceId,
      { relations: ["createdBy"] }
    );
    if (healthcareToken.createdBy.role === UserRole.NHSO) {
      await this.transferTokenFromNHSO(userId, serviceId, pin);
    } else if (healthcareToken.createdBy.role === UserRole.Agency) {
      const checkKeypair = await this.keypairService.isActive(
        userId,
        healthcareToken.createdBy.id
      );
      if (!checkKeypair.isActive) {
        await this.keypairService.createKeypair(
          userId,
          pin,
          healthcareToken.createdBy.id
        );
      }
      const publicKey = await this.keypairService.findPublicKey(
        userId,
        healthcareToken.createdBy.id
      );
      await this.addTrustline(userId, serviceId, pin, healthcareToken.createdBy.id);
      await this.agencyService.notifyAddedTrustline(userId, serviceId, publicKey);
    } else {
      throw new BadRequestException("This service is not created by NHSO or Agency");
    }

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
    if (userToken.balance <= 0) {
      throw new BadRequestException(
        `${userToken.healthcareToken.name} is exceeded the redemption limit`
      );
    }
    if (!userToken.healthcareToken.isActive) {
      throw new BadRequestException(
        `${userToken.healthcareToken.name} was alredy deactivated`
      );
    }
    if (dayjs().isAfter(dayjs(userToken.healthcareToken.endDate), "day")) {
      throw new BadRequestException(`${userToken.healthcareToken.name} is expired`);
    }
    return userToken;
  }

  async findActiveRequest(userId: number): Promise<TransferRequest> {
    const request = await this.transferRequestRepository.findOne({
      where: {
        patient: { id: userId },
        expiredDate: MoreThan(dayjs().toDate()),
        isConfirmed: false,
      },
      relations: ["healthcareToken"],
    });
    if (!request) {
      throw new NotFoundException("No active redeem request");
    }
    return request;
  }

  async createRedeemRequest(
    userId: number,
    patientId: number,
    serviceId: number,
    amount: number,
    pin: string
  ): Promise<TransferRequest> {
    await this.keypairService.validatePin(userId, pin);
    const hospital = await this.userService.findById(userId);
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
    const patient = await this.userService.findById(patientId);
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

  async checkConfirmRedeemRequest(id: number): Promise<{ isConfirmed: boolean }> {
    const transferRequest = await this.transferRequestRepository.findOne(id);
    if (!transferRequest) {
      throw new BadRequestException(`Coudn't find redeem request id: ${id}`);
    }
    return { isConfirmed: transferRequest.isConfirmed };
  }

  async deleteRedeemRequest(id: number): Promise<void> {
    await this.transferRequestRepository.softDelete({
      id: id,
      isConfirmed: false,
      type: TransferRequestType.Redemption,
    });
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
    const hospital = await this.userService.findById(userId);
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

    const patient = await this.userService.findById(patientId);
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
    const validSpecialTokens = await this.findValidSpecialTokens(userId);
    if (
      validSpecialTokens.findIndex(
        (validSpecialToken) => validSpecialToken.id === serviceId
      ) === -1
    ) {
      throw new BadRequestException("This service is not valid for this user");
    }

    await this.transferTokenFromNHSO(userId, serviceId, pin);
    existedTransferRequest.isConfirmed = true;
    await this.transferRequestRepository.save(existedTransferRequest);
  }

  async withDraw(
    userId: number,
    serviceId: number,
    amount: number,
    pin: string
  ): Promise<Slip> {
    const user = await this.userService.findById(userId, true);
    const healthcareToken = await this.healthcareTokenRepository.findOne(serviceId);
    const userToken = await this.userTokenRepository.findOne({
      where: { user: { id: userId }, healthcareToken: { id: serviceId } },
    });
    if (amount > userToken.balance) {
      throw new BadRequestException(
        `Amount must not be greater than ${healthcareToken.name} token balance`
      );
    }
    const privateKey = await this.keypairService.decryptPrivateKey(userId, pin);
    const publicKey = await this.keypairService.findPublicKey(userId);

    let stellarTxId: string;
    await this.connection.transaction(async (manager) => {
      await this.transactionService.create(
        userId,
        publicKey,
        null,
        healthcareToken.issuingPublicKey,
        serviceId,
        amount,
        manager
      );
      await manager.decrement(
        UserToken,
        { user: { id: userId }, healthcareToken: { id: serviceId } },
        "balance",
        amount
      );
      stellarTxId = await this.stellarService.transferToken(
        privateKey,
        healthcareToken.issuingPublicKey,
        healthcareToken.assetCode,
        healthcareToken.issuingPublicKey,
        amount
      );
    });

    const slip = new Slip();
    slip.amount = amount;
    slip.destinationPublicKey = healthcareToken.issuingPublicKey;
    slip.healthcareToken = healthcareToken;
    slip.hospital = user.hospital;
    slip.sourcePublicKey = publicKey;
    slip.transactionId = stellarTxId;
    return slip;
  }

  private async addTrustline(
    userId: number,
    serviceId: number,
    pin: string,
    agencyId?: number
  ) {
    const user = await this.userService.findById(userId);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const privateKey = await this.keypairService.decryptPrivateKey(userId, pin, agencyId);
    const newUserToken = this.userTokenRepository.create();
    newUserToken.isTrusted = true;
    newUserToken.balance = 0;
    newUserToken.healthcareToken = healthcareToken;
    newUserToken.user = user;

    await this.connection.transaction(async (manager) => {
      await manager.save(newUserToken);
      await this.stellarService.changeTrust(
        privateKey,
        healthcareToken.assetCode,
        healthcareToken.issuingPublicKey
      );
    });

    //Todo: update XDR
  }

  private async transferToken(
    sourceUserId: number,
    destinationUserId: number,
    serviceId: number,
    amount: number,
    pin: string
  ) {
    const sourceUser = await this.userService.findById(sourceUserId);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const sourceUserBalance = await this.userTokenRepository.findOneOrFail({
      where: { user: sourceUser, healthcareToken: healthcareToken },
    });
    const privateKey = await this.keypairService.decryptPrivateKey(sourceUserId, pin);
    const sourcePublicKey = await this.keypairService.findPublicKey(sourceUserId);
    const destinationPublicKey = await this.keypairService.findPublicKey(
      destinationUserId
    );

    if (amount <= 0) {
      throw new BadRequestException("Amount must be greater than 0");
    }

    if (amount > sourceUserBalance.balance) {
      throw new BadRequestException("Source account doesn't have enough tokens");
    }

    await this.connection.transaction(async (manager) => {
      await this.transactionService.create(
        sourceUserId,
        sourcePublicKey,
        destinationUserId,
        destinationPublicKey,
        serviceId,
        amount,
        manager
      );
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
        destinationPublicKey,
        healthcareToken.assetCode,
        healthcareToken.issuingPublicKey,
        amount
      );
    });
    //Todo: update XDR
  }

  private async transferTokenFromNHSO(userId: number, serviceId: number, pin: string) {
    const user = await this.userService.findById(userId);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(
      serviceId,
      { relations: ["createdBy"] }
    );
    const privateKey = await this.keypairService.decryptPrivateKey(userId, pin);
    const publicKey = StellarSdk.Keypair.fromSecret(privateKey).publicKey();

    if (healthcareToken.tokenPerPerson > healthcareToken.remainingToken) {
      throw new BadRequestException(
        `${healthcareToken.name} doesn't have enough remaining token`
      );
    }

    const userToken = await this.userTokenRepository.findOne({
      where: { user: { id: userId }, healthcareToken: { id: serviceId } },
    });

    await this.connection.transaction(async (manager) => {
      await this.transactionService.create(
        healthcareToken.createdBy.id,
        healthcareToken.receivingPublicKey,
        userId,
        publicKey,
        serviceId,
        healthcareToken.tokenPerPerson,
        manager
      );
      await manager.decrement(
        HealthcareToken,
        { id: serviceId },
        "remainingToken",
        healthcareToken.tokenPerPerson
      );
      if (!userToken || !userToken.isTrusted) {
        const newUserToken = this.userTokenRepository.create();
        newUserToken.isTrusted = true;
        newUserToken.balance = healthcareToken.tokenPerPerson;
        newUserToken.healthcareToken = healthcareToken;
        newUserToken.user = user;
        await manager.save(newUserToken);
        await this.stellarService.changeTrust(
          privateKey,
          healthcareToken.assetCode,
          healthcareToken.issuingPublicKey
        );
      } else {
        await manager.increment(
          UserToken,
          { user: { id: userId }, healthcareToken: { id: serviceId } },
          "balance",
          healthcareToken.tokenPerPerson
        );
      }
      await this.stellarService.transferToken(
        this.stellarReceivingSecret,
        publicKey,
        healthcareToken.assetCode,
        healthcareToken.issuingPublicKey,
        healthcareToken.tokenPerPerson
      );
    });
    //Todo: update XDR
  }

  private validateBasicRule(user: User, healthcareToken: HealthcareToken): boolean {
    const now = dayjs();
    const userAge = now.diff(user.patient.birthDate, "year");
    if (!healthcareToken.isActive) {
      return false;
    }
    if (healthcareToken.startAge && healthcareToken.startAge > userAge) {
      return false;
    }
    if (healthcareToken.endAge && healthcareToken.endAge < userAge) {
      return false;
    }
    if (healthcareToken.gender && healthcareToken.gender != user.patient.gender) {
      return false;
    }
    if (healthcareToken.startDate && now.isBefore(healthcareToken.startDate, "day")) {
      return false;
    }
    if (healthcareToken.endDate && now.isAfter(healthcareToken.endDate, "day")) {
      return false;
    }
    return true;
  }

  private basicRulesQuery(user: User): SelectQueryBuilder<HealthcareToken> {
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
      .andWhere("healthcare_token.remaining_token > 0");
    return query;
  }
}
