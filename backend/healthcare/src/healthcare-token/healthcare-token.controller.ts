import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { HealthcareTokenService } from "./healthcare-token.service";
import { Pagination } from "../utils/pagination.util";
import {
  CreateTransferRequestDto,
  HealthcareTokenDto,
  ServiceAndPinDto,
  VerificationInfoDto,
} from "./healthcare-token.dto";
import { TokenType } from "src/constant/enum/token.enum";
import { UserId } from "src/decorators/user-id.decorator";
import { TransferRequest } from "src/entities/transfer-request.entity";

@ApiBearerAuth()
@ApiTags("Healthcare Token")
@Controller("healthcare-token")
@UseGuards(RolesGuard)
export class HealthcareTokenController {
  constructor(private readonly healthcareTokenService: HealthcareTokenService) {}

  @Get()
  @Roles(UserRole.NHSO)
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
  async createToken(@Body() dto: HealthcareTokenDto): Promise<HealthcareToken> {
    return this.healthcareTokenService.createToken(dto);
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
    return this.healthcareTokenService.receiveToken(userId, dto);
  }

  @Get("verify")
  @Roles(UserRole.Hospital)
  @ApiQuery({ name: "userId", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "serviceId", schema: { type: "integer" }, required: true })
  async getVerificationInfo(
    @Query("userId") qUserId: number,
    @Query("serviceId") qServiceId: number
  ): Promise<VerificationInfoDto> {
    return this.healthcareTokenService.getVerificationInfo(qUserId, qServiceId);
  }

  @Post("redeem-request")
  @Roles(UserRole.Hospital)
  async requestRedeemToken(
    @UserId() userId,
    @Body() dto: CreateTransferRequestDto
  ): Promise<TransferRequest> {
    return this.healthcareTokenService.requestRedeemToken(
      userId,
      dto.userId,
      dto.serviceId,
      dto.amount
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

  @Post("trustline")
  @Roles(UserRole.Patient, UserRole.Hospital)
  async addTrustline(
    @UserId() userId: number,
    @Body() dto: ServiceAndPinDto
  ): Promise<void> {
    return this.healthcareTokenService.addTrustline(userId, dto.serviceId, dto.pin);
  }
}
