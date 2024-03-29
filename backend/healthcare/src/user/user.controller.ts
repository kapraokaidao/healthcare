import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserId } from "../decorators/user-id.decorator";
import { User } from "../entities/user.entity";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { Pagination } from "../utils/pagination.util";
import { SearchUsersDto } from "./user.dto";
import { isBetween } from "../utils/number.util";
import { KycQueryType } from "../constant/enum/kyc.enum";

@ApiBearerAuth()
@ApiTags("User")
@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(
    UserRole.NHSO,
    UserRole.HospitalAdmin,
    UserRole.Hospital,
    UserRole.Patient,
    UserRole.Agency
  )
  @Get("me")
  async me(@UserId() id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @Roles(UserRole.NHSO)
  @Get()
  @ApiQuery({ name: "page", schema: { type: "integer" } })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" } })
  @ApiQuery({ name: "role", schema: { type: "string" }, enum: UserRole })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query("role") role: UserRole
  ): Promise<Pagination<User>> {
    const conditions = {};
    if (role) conditions["role"] = role;
    return this.userService.find(conditions, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @Post()
  async createUser(@UserId() id: number, @Body() user: User): Promise<User> {
    const newUser = await this.userService.create(user);
    return this.userService.findById(newUser.id, true);
  }

  @Roles(UserRole.NHSO)
  @Get("kyc")
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "approved", schema: { type: "string" }, required: false })
  @ApiQuery({ name: "ready", schema: { type: "string" }, required: false })
  @ApiQuery({
    name: "type",
    schema: { type: "enum" },
    enum: KycQueryType,
    required: false,
  })
  async find(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query("approved", new DefaultValuePipe(false), ParseBoolPipe) approved: boolean,
    @Query("ready", new DefaultValuePipe(true), ParseBoolPipe) ready: boolean,
    @Query("type") type: KycQueryType
  ): Promise<Pagination<User>> {
    if (!Object.values(KycQueryType).includes(type)) {
      throw new BadRequestException(`invalid kyc type [${type}]`);
    }
    return this.userService.findKyc(approved, ready, type, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @HttpCode(200)
  @Post("search")
  async searchUsers(@Body() dto: SearchUsersDto): Promise<Pagination<User>> {
    const page = dto.page ? dto.page : 1;
    const pageSize = isBetween(dto.pageSize, 0, 1001) ? dto.pageSize : 100;
    return this.userService.search(dto.user, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @Get("deleted")
  async findSoftDeletedUsers(): Promise<User[]> {
    return this.userService.findSoftDeletedUsers();
  }

  @Roles(UserRole.NHSO)
  @Post("password/reset/:id/approve")
  async approveResetPassword(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.approveResetPassword(id);
  }

  @Roles(UserRole.NHSO)
  @Post("password/reset/:id/reject")
  async rejectResetPassword(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.rejectResetPassword(id);
  }

  @Roles(
    UserRole.NHSO,
    UserRole.Hospital,
    UserRole.Patient,
    UserRole.Agency,
    UserRole.HospitalAdmin
  )
  @Get(":id")
  async findById(@Param("id") id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @Roles(UserRole.NHSO)
  @Delete(":id")
  async softDeleteUser(@Param("id") id: number): Promise<void> {
    await this.userService.softDelete(id);
  }

  @Roles(UserRole.NHSO)
  @Delete(":id/permanent")
  async hardDeleteUser(@Param("id") id: number): Promise<void> {
    await this.userService.hardDelete(id);
  }

  @Roles(UserRole.NHSO)
  @Post(":id/restore")
  async restore(@Param("id") id: number): Promise<void> {
    await this.userService.restore(id);
  }

  @Roles(UserRole.NHSO)
  @Post(":id/kyc/approve")
  async approve(@Param("id") id: number): Promise<void> {
    await this.userService.approveKyc(id);
  }

  @Roles(UserRole.NHSO)
  @Post(":id/kyc/reject")
  async reject(@Param("id") id: number): Promise<void> {
    await this.userService.rejectKyc(id);
  }

  @Roles(UserRole.Patient)
  @Post("/upload/national-id")
  @Redirect("patient/upload/national-id", 301)
  async uploadNationalIdImage() {
    // const path = `user_${id}/kyc/national-id_${Date.now()}.jpg`;
    // const imageUrl = await this.s3Service.uploadImage(image, path);
    // await this.userService.updateImage(id, imageUrl, KycImageType.NationalId);
  }

  @Roles(UserRole.Patient)
  @Post("upload/selfie")
  @Redirect("patient/upload/selfie", 301)
  async uploadSelfieImage() {
    // const path = `user_${id}/kyc/selfie_${Date.now()}.jpg`;
    // const imageUrl = await this.s3Service.uploadImage(image, path);
    // await this.userService.updateImage(id, imageUrl, KycImageType.Selfie);
  }
}
