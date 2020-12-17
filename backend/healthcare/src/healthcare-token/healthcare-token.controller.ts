import { Body, Controller, Get, Post, Put, Param,Query, UseGuards, BadRequestException } from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { HealthcareTokenService } from "./healthcare-token.service";
import { Pagination } from "../utils/pagination";
import { HealthcareTokenDto } from "./healthcare-token.dto";
import { StellarService } from "src/stellar/stellar.service";
import { ConfigService } from "@nestjs/config";

@ApiBearerAuth()
@ApiTags("Healthcare Token")
@Controller("healthcare-token")
@UseGuards(RolesGuard)
export class HealthcareTokenController {

  private readonly stellarIssuingSecret;
  private readonly stellarReceivingSecret;

  constructor(private readonly healthcareTokenService: HealthcareTokenService, private readonly stellarService: StellarService, private readonly configService: ConfigService) {
    this.stellarIssuingSecret = this.configService.get<string>("stellar.issuingSecret");
    this.stellarReceivingSecret = this.configService.get<string>("stellar.receivingSecret");
  }

  @Get()
  @Roles(UserRole.NHSO)
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "isActive", schema: { type: "boolean" }, enum: ['true','false'], required: false })
  async findAllToken(
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string,
    @Query("isActive") qIsActive: string
  ): Promise<Pagination<HealthcareToken>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const conditions = {};
    if(typeof qIsActive !== "undefined") conditions['isActive'] = qIsActive==='true';
    return this.healthcareTokenService.find(conditions, { page, pageSize });
  }

  @Post()
  @Roles(UserRole.NHSO)
  async createToken(@Body() dto: HealthcareTokenDto): Promise<HealthcareToken> {
    const isExisted = await this.healthcareTokenService.isExisted(dto);
    if(isExisted){
      throw new BadRequestException(`Token name '${dto.name} is already existed'`);
    }
    const public_keys = await this.stellarService.issueToken(this.stellarIssuingSecret, this.stellarReceivingSecret, dto.name, dto.totalToken);
    dto = {
      ...dto,
      ...public_keys
    }
    return this.healthcareTokenService.createToken(dto);
  }

  @Put('deactivate/:id')
  @Roles(UserRole.NHSO)
  async deactivateToken(@Param("id") id: number): Promise<HealthcareToken> {
    return this.healthcareTokenService.deactivateToken(id);
  }
}
