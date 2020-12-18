import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserId } from "../decorators/user-id.decorator";
import { User } from "../entities/user.entity";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";
import { Pagination } from "../utils/pagination";
import { KycImageType, SearchUsersDto } from "./user.dto";
import { FileUploadDto } from "../config/file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "../s3/s3.service";

@ApiBearerAuth()
@ApiTags("User")
@Controller("user")
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service
  ) {}

  @Roles(UserRole.NHSO, UserRole.Hospital, UserRole.Patient)
  @Get("me")
  async me(@UserId() id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @Roles(UserRole.NHSO)
  @Get()
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "role", schema: { type: "string" }, required: false, enum: UserRole })
  async findAll(
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string,
    @Query("role") qRole: UserRole
  ): Promise<Pagination<User>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const conditions = {};
    if (qRole) conditions["role"] = qRole;
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
  async find(
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string,
    @Query("approved") approved: string,
    @Query("ready") qReady: string
  ): Promise<Pagination<User>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const ready = qReady && qReady === "true";
    return this.userService.findKyc(approved, ready, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @HttpCode(200)
  @Post("search")
  async searchUsers(@Body() dto: SearchUsersDto): Promise<Pagination<User>> {
    const page = dto.page !== null ? dto.page : 1;
    const pageSize = dto.pageSize !== null ? dto.pageSize : 10;
    return this.userService.search(dto.user, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @Get("deleted")
  async findSoftDeletedUsers(): Promise<User[]> {
    return this.userService.findSoftDeletedUsers();
  }

  @Roles(UserRole.NHSO, UserRole.Hospital, UserRole.Patient)
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadNationalIdImage(@UserId() id: number, @UploadedFile() image) {
    const path = `user_${id}/kyc/national-id.jpg`;
    const imageUrl = await this.s3Service.uploadImage(image, path);
    await this.userService.updateImage(id, imageUrl, KycImageType.NationalId);
  }

  @Roles(UserRole.Patient)
  @Post("/upload/selfie")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadSelfieImage(@UserId() id: number, @UploadedFile() image) {
    const path = `user_${id}/kyc/selfie.jpg`;
    const imageUrl = await this.s3Service.uploadImage(image, path);
    await this.userService.updateImage(id, imageUrl, KycImageType.Selfie);
  }
}
