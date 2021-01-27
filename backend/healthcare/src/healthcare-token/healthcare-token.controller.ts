import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { HealthcareTokenService } from "./healthcare-token.service";
import { Pagination } from "../utils/pagination.util";
import {
  CreateRedeemRequestDto,
  CreateSpecialTokenRequestDto,
  HealthcareTokenDto,
  ServiceAndPinDto,
  Slip,
  WithdrawDto,
} from "./healthcare-token.dto";
import { TokenType } from "src/constant/enum/token.enum";
import { UserId } from "src/decorators/user-id.decorator";
import { TransferRequest } from "src/entities/transfer-request.entity";
import { UserToken } from "src/entities/user-token.entity";

@ApiBearerAuth()
@ApiTags("Healthcare Token")
@Controller("healthcare-token")
@UseGuards(RolesGuard)
export class HealthcareTokenController {
  constructor(private readonly healthcareTokenService: HealthcareTokenService) {}

  @Get("/:serviceId")
  @Roles(UserRole.Hospital, UserRole.Patient, UserRole.NHSO)
  async (
    @Param("serviceId") serviceId: number
  ): Promise<HealthcareToken> {
    return this.healthcareTokenService.findById(serviceId);
  }

  @Get()
  @Roles(UserRole.NHSO, UserRole.Hospital)
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  @ApiQuery({
    name: "isActive",
    schema: { type: "string" },
    enum: ["true", "false"],
    required: false,
  })
  @ApiQuery({
    name: "tokenType",
    schema: { type: "string" },
    enum: TokenType,
    required: false,
  })
  async findAllToken(
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string,
    @Query("isActive") qIsActive: string,
    @Query("tokenType") qTokenType: string
  ): Promise<Pagination<HealthcareToken>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const conditions = {};
    if (qIsActive) conditions["isActive"] = qIsActive === "true";
    if (qTokenType) conditions["tokenType"] = qTokenType;
    return this.healthcareTokenService.find(conditions, { page, pageSize });
  }

  @Post()
  @Roles(UserRole.NHSO)
  async createToken(
    @UserId() userId,
    @Body() dto: HealthcareTokenDto
  ): Promise<HealthcareToken> {
    return this.healthcareTokenService.createToken(userId, dto);
  }

  @Put("deactivate/:id")
  @Roles(UserRole.NHSO)
  async deactivateToken(@Param("id") id: number): Promise<HealthcareToken> {
    return this.healthcareTokenService.deactivateToken(id);
  }

  @Get("valid")
  @Roles(UserRole.Patient)
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  async findValidToken(
    @UserId() userId: number,
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string
  ): Promise<Pagination<HealthcareToken>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    return this.healthcareTokenService.findValidTokens(userId, { page, pageSize });
  }

  @Post("receive")
  @Roles(UserRole.Patient)
  async receiveToken(
    @UserId() userId: number,
    @Body() dto: ServiceAndPinDto
  ): Promise<void> {
    return this.healthcareTokenService.receiveToken(userId, dto.serviceId, dto.pin);
  }

  @Get("verify")
  @Roles(UserRole.Hospital)
  @ApiQuery({ name: "userId", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "serviceId", schema: { type: "integer" }, required: true })
  async getVerificationInfo(
    @Query("userId") qUserId: number,
    @Query("serviceId") qServiceId: number
  ): Promise<UserToken> {
    return this.healthcareTokenService.getVerificationInfo(qUserId, qServiceId);
  }

  @Delete("redeem-request")
  @Roles(UserRole.Hospital)
  @ApiQuery({ name: "id", schema: { type: "integer" }, required: true })
  async deleteRedeemRequest(@Query("id") id: number): Promise<void> {
    return this.healthcareTokenService.deleteRedeemRequest(id);
  }

  @Get("redeem-check")
  @Roles(UserRole.Hospital)
  @ApiQuery({ name: "id", schema: { type: "integer" }, required: true })
  async checkConfirmedRedeemRequest(
    @Query("id") id: number
  ): Promise<{ isConfirmed: boolean }> {
    return this.healthcareTokenService.checkConfirmRedeemRequest(id);
  }

  @Post("redeem-request")
  @Roles(UserRole.Hospital)
  async createRedeemRequest(
    @UserId() userId,
    @Body() dto: CreateRedeemRequestDto
  ): Promise<TransferRequest> {
    return this.healthcareTokenService.createRedeemRequest(
      userId,
      dto.userId,
      dto.serviceId,
      dto.amount,
      dto.pin
    );
  }

  @Post("redeem")
  @Roles(UserRole.Patient)
  async redeemToken(
    @UserId() userId: number,
    @Body() dto: ServiceAndPinDto
  ): Promise<void> {
    return this.healthcareTokenService.redeemToken(userId, dto.serviceId, dto.pin);
  }

  @Get("special-token/valid/:userId")
  @Roles(UserRole.Hospital)
  async findValidSpecialTokens(
    @Param("userId") userId: number
  ): Promise<HealthcareToken[]> {
    return this.healthcareTokenService.findValidSpecialTokens(userId);
  }

  @Post("special-token/receive")
  @Roles(UserRole.Patient)
  async retreiveSpecialToken(
    @UserId() userId: number,
    @Body() dto: ServiceAndPinDto
  ): Promise<void> {
    return this.healthcareTokenService.receiveSpecialToken(
      userId,
      dto.serviceId,
      dto.pin
    );
  }

  @Post("special-token/request")
  @Roles(UserRole.Hospital)
  async createSpecialTokenRequest(
    @UserId() userId,
    @Body() dto: CreateSpecialTokenRequestDto
  ): Promise<TransferRequest> {
    return this.healthcareTokenService.createSpecialTokenRequest(
      userId,
      dto.userId,
      dto.serviceId,
      dto.pin
    );
  }

  @Get("balance")
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  @Roles(UserRole.Hospital, UserRole.Patient)
  async getBalance(
    @UserId() userId,
    @Query("page") qPage: number,
    @Query("pageSize") qPageSize: number
  ): Promise<Pagination<UserToken>> {
    return this.healthcareTokenService.getBalance(userId, {
      page: qPage,
      pageSize: qPageSize,
    });
  }

  @Post("withdraw")
  @Roles(UserRole.Hospital)
  async withdraw(@UserId() userId: number, @Body() dto: WithdrawDto): Promise<Slip> {
    return this.healthcareTokenService.withDraw(
      userId,
      dto.serviceId,
      dto.amount,
      dto.pin
    );
  }
}
