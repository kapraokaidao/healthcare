import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  AuthCredentialsDto,
  ChangePasswordDto,
  PatientAuthCredentialsDto,
  ResetPasswordDto,
} from "./auth.dto";
import { User } from "../entities/user.entity";
import { PublicAPI } from "../decorators/public-api.decorator";
import { FileUploadDto } from "../config/file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";

@ApiTags("Auth")
@Controller("auth")
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Post("agency/login")
  async agencyLogin(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential, UserRole.Agency);
  }

  @PublicAPI()
  @Post("hospital/login")
  async hospitalLogin(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential, UserRole.Hospital);
  }

  @PublicAPI()
  @Post("nhso/login")
  async nhsoLogin(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential, UserRole.NHSO);
  }

  @PublicAPI()
  @Post("patient/login")
  async patientLogin(@Body() credential: PatientAuthCredentialsDto) {
    return this.authService.login(credential, UserRole.Patient);
  }

  @PublicAPI()
  @Post("register")
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @PublicAPI()
  @Post("password/change")
  async changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    await this.authService.changePassword(dto);
  }

  @PublicAPI()
  @Post("password/reset")
  async resetPassword(
    @Body() dto: ResetPasswordDto
  ): Promise<{ resetPasswordId: number }> {
    return this.authService.resetPassword(dto);
  }

  @PublicAPI()
  @Post("password/reset/:id/upload/national-id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadNationalIdImage(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image
  ) {
    await this.authService.uploadResetPasswordNationalIdImage(id, image);
  }

  @PublicAPI()
  @Post("password/reset/:id/upload/selfie")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadSelfieImage(@Param("id", ParseIntPipe) id: number, @UploadedFile() image) {
    await this.authService.uploadResetPasswordSelfieImage(id, image);
  }

  /**
   *  Start non-public API
   */

  @ApiBearerAuth()
  @Roles(UserRole.NHSO)
  @Post("password/reset/:id/approved")
  async approveResetPassword(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.authService.approveResetPassword(id);
  }

  @Roles(UserRole.NHSO)
  @Post("password/reset/:id/reject")
  async rejectResetPassword(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.authService.rejectResetPassword(id);
  }
}
