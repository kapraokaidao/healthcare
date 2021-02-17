import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PatientService } from "./patient.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Patient } from "../entities/patient.entity";
import { UserId } from "../decorators/user-id.decorator";
import { PatientInfoUpdateDto } from "./patient.dto";
import { RegisterStatus, UserRole } from "../constant/enum/user.enum";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { FileUploadDto } from "../config/file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { KycImageType } from "../constant/enum/kyc.enum";
import { PublicAPI } from "../decorators/public-api.decorator";
import {
  AuthResponseDto,
  ChangePasswordDto,
  PatientAuthCredentialsDto,
  ResetPasswordDto,
} from "../auth/auth.dto";
import { AuthService } from "../auth/auth.service";
import { User } from "../entities/user.entity";

@ApiBearerAuth()
@ApiTags("Patient")
@Controller("patient")
@UseGuards(RolesGuard)
@Roles(UserRole.Patient)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) {}

  @PublicAPI()
  @Post("login")
  async patientLogin(@Body() credential: PatientAuthCredentialsDto) {
    return this.authService.login(credential, UserRole.Patient);
  }

  @PublicAPI()
  @Post("register")
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Patch()
  async patchPatient(
    @UserId() id: number,
    @Body() dto: PatientInfoUpdateDto
  ): Promise<Patient> {
    return await this.patientService.update(id, dto);
  }

  @Get("register/status")
  async getRegisterStatus(@UserId() id: number): Promise<RegisterStatus> {
    return this.patientService.getRegisterStatus(id);
  }

  @Post("/upload/national-id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadNationalIdImage(@UserId() id: number, @UploadedFile() image) {
    await this.patientService.updateImage(id, image, KycImageType.NationalId);
  }

  @Post("/upload/selfie")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadSelfieImage(@UserId() id: number, @UploadedFile() image) {
    await this.patientService.updateImage(id, image, KycImageType.Selfie);
  }

  @PublicAPI()
  @Post("password/change")
  async changePassword(@Body() dto: ChangePasswordDto): Promise<AuthResponseDto> {
    return this.authService.changePassword(dto, UserRole.Patient);
  }

  @PublicAPI()
  @Post("password/reset")
  async resetPassword(
    @Body() dto: ResetPasswordDto
  ): Promise<{ resetPasswordId: number }> {
    return this.patientService.resetPassword(dto);
  }

  @PublicAPI()
  @Post("password/reset/:id/upload/national-id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadNationalIdImageResetPassword(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image
  ) {
    await this.patientService.uploadResetPasswordNationalIdImage(id, image);
  }

  @PublicAPI()
  @Post("password/reset/:id/upload/selfie")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor("image"))
  async uploadSelfieImageResetPassword(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image
  ) {
    await this.patientService.uploadResetPasswordSelfieImage(id, image);
  }
}
