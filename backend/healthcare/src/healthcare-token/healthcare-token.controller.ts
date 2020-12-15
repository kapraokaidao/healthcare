import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { HealthcareTokenService } from "./healthcare-token.service";
import { Pagination } from "../utils/pagination";
import { HealthcareTokenDto } from "./healthcare-token.dto";
import { StellarService } from "src/stellar/stellar.service";

@ApiBearerAuth()
@ApiTags("Healthcare Token")
@Controller("healthcare-token")
@UseGuards(RolesGuard)
export class HealthcareTokenController {
  constructor(private readonly healthcareTokenService: HealthcareTokenService, private readonly stellarService: StellarService) {}

  @Get()
  @Roles(UserRole.NHSO)
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  async findAllToken(
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string
  ): Promise<Pagination<HealthcareToken>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    return this.healthcareTokenService.find({}, { page, pageSize });
  }

  @Post()
  @Roles(UserRole.NHSO)
  async createToken(@Body() dto: HealthcareTokenDto): Promise<HealthcareToken> {
    const public_keys = await this.stellarService.issueToken(dto.name, dto.totalToken);
    dto = {
      ...dto,
      ...public_keys
    }
    return this.healthcareTokenService.createToken(dto);
  }
}
