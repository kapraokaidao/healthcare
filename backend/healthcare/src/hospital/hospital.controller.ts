import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guard";
import { HospitalService } from "./hospital.service";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { Pagination } from "../utils/pagination.util";
import { CreateHospitalDto, SearchHospitalDto } from "./hospital.dto";
import { Hospital } from "../entities/hospital.entity";
import { isBetween } from "../utils/number.util";
import { UserId } from "../decorators/user-id.decorator";
import { PublicAPI } from "../decorators/public-api.decorator";
import { AuthCredentialsDto } from "../auth/auth.dto";
import { AuthService } from "../auth/auth.service";

@ApiBearerAuth()
@ApiTags("Hospital")
@Controller("hospital")
@UseGuards(RolesGuard)
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly authService: AuthService
  ) {}

  @PublicAPI()
  @Post("login")
  async hospitalLogin(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential, UserRole.Hospital);
  }

  @Roles(UserRole.HospitalAdmin)
  @Post()
  async create(@UserId() id: number, @Body() dto: CreateHospitalDto): Promise<void> {
    await this.hospitalService.create(id, dto);
  }

  @Roles(UserRole.NHSO)
  @HttpCode(200)
  @Post("search")
  async searchHospital(@Body() dto: SearchHospitalDto): Promise<Pagination<Hospital>> {
    const page = Number.isInteger(dto.page) && dto.page > 0 ? dto.page : 1;
    const pageSize = isBetween(dto.pageSize, 0, 1001) ? dto.pageSize : 100;
    return this.hospitalService.search(dto.hospital, { page, pageSize });
  }
}
