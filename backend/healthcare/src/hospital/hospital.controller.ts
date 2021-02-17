import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guard";
import { HospitalService } from "./hospital.service";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { Pagination } from "../utils/pagination.util";
import { CreateHospitalDto, SearchHospitalAccountDto, SearchHospitalDto } from "./hospital.dto";
import { Hospital } from "../entities/hospital.entity";
import { isBetween } from "../utils/number.util";
import { UserId } from "../decorators/user-id.decorator";
import { PublicAPI } from "../decorators/public-api.decorator";
import { AuthCredentialsDto, AuthResponseDto, ChangePasswordDto } from "../auth/auth.dto";
import { AuthService } from "../auth/auth.service";
import { User } from "src/entities/user.entity";

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

  @Roles(UserRole.HospitalAdmin)
  @HttpCode(200)
  @Post("hospital-account/search")
  async searchHospitalAccount(@UserId() userId: number, @Body() dto: SearchHospitalAccountDto): Promise<Pagination<User>> {
    const page = Number.isInteger(dto.page) && dto.page > 0 ? dto.page : 1;
    const pageSize = isBetween(dto.pageSize, 0, 1001) ? dto.pageSize : 100;
    return this.hospitalService.searchHospitalAccount(userId, dto.user, { page, pageSize });
  }

  @Roles(UserRole.HospitalAdmin)
  @HttpCode(200)
  @Delete("hospital-account/:id")
  async deleteHospitalAccount(@UserId() userId: number, @Param("id") id: number): Promise<void> {
    return this.hospitalService.delete(userId, id);
  }

  @Roles(UserRole.Hospital, UserRole.HospitalAdmin)
  @PublicAPI()
  @Post("password/change")
  async changePassword(@Body() dto: ChangePasswordDto): Promise<AuthResponseDto> {
    return this.authService.changePassword(dto, UserRole.Hospital);
  }
  
}
