import { Body, Controller, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto, ChangePasswordDto, ResetPasswordDto } from "./auth.dto";
import { User } from "../entities/user.entity";
import { PublicAPI } from "../decorators/public-api.decorator";
import { FileUploadDto } from "../config/file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserId } from "../decorators/user-id.decorator";
import { KycImageType } from "../user/user.dto";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { S3Service } from "../s3/s3.service";
import { PatientService } from "../user/patient.service";

@PublicAPI()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly patientService: PatientService,
    private readonly s3Service: S3Service,
  ) {}

  @Post("login")
  async login(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential);
  }

  @Post("register")
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post("password/change")
  async changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    await this.authService.changePassword(dto);
  }

  @Post("password/reset")
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ resetPasswordId: number }> {
    return this.authService.resetPassword(dto);
  }

  @Post("password/reset/:id/upload/national-id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadNationalIdImage(@Param("id", ParseIntPipe) id: number, @UploadedFile() image) {
    const resetPasswordKYC = await ResetPasswordKYC.findOneOrFail(id, { relations: ["patient"] });
    const patient = await this.patientService.findById(resetPasswordKYC.patient.id, true);
    const userId = patient.user.id;
    const path = `user_${userId}/reset-password/national-id_${Date.now()}.jpg`;
    resetPasswordKYC.nationalIdImage = await this.s3Service.uploadImage(image, path);
    await resetPasswordKYC.save();
  }

  @Post("password/reset/:id/upload/selfie")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadSelfieImage(@Param("id", ParseIntPipe) id: number, @UploadedFile() image) {
    const resetPasswordKYC = await ResetPasswordKYC.findOneOrFail(id, { relations: ["patient"] });
    const patient = await this.patientService.findById(resetPasswordKYC.patient.id, true);
    const userId = patient.user.id;
    const path = `user_${userId}/reset-password/selfie_${Date.now()}.jpg`;
    resetPasswordKYC.selfieImage = await this.s3Service.uploadImage(image, path);
    await resetPasswordKYC.save();
  }
}
