import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto, AuthResponseDto, ChangePasswordDto } from "./auth.dto";
import { User } from "../entities/user.entity";
import { compareSync } from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "../constant/enum/user.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  sign(payload): string {
    return this.jwtService.sign(payload);
  }

  async validateUser(
    credentials: AuthCredentialsDto,
    role: UserRole
  ): Promise<Omit<User, "password">> {
    const { username, password } = credentials;
    const user: User = await this.userService.findByUsernameAndRole(username, role, true);
    if (user && compareSync(password, user.password)) {
      const { password, ...userDto } = user;
      return userDto;
    }
    return null;
  }

  async login(credential: AuthCredentialsDto, role: UserRole): Promise<AuthResponseDto> {
    const user: Omit<User, "password"> = await this.validateUser(credential, role);
    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }
    const access_token = this.jwtService.sign({ user });
    return { access_token };
  }

  // TODO: no register on production !!!
  async register(user: User): Promise<AuthResponseDto> {
    const existedUser = await this.userService.findByUsername(user.username);
    if (existedUser) {
      throw new BadRequestException("Username already existed");
    }
    await this.userService.create(user);
    const credentials = { username: user.username, password: user.password };
    return this.login(credentials, user.role);
  }

  async changePassword(dto: ChangePasswordDto, role: UserRole): Promise<AuthResponseDto> {
    const { newPassword, ...authDto } = dto;
    const user: Omit<User, "password"> = await this.validateUser(authDto, role);
    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }
    user["password"] = newPassword;
    const updatedUser = this.userRepository.create(user);
    await this.userRepository.save(updatedUser);
    return this.login({ username: user.username, password: newPassword }, role);
  }
  //
  // async resetPassword(dto: ResetPasswordDto): Promise<{ resetPasswordId: number }> {
  //   let user: User = await this.userService.findByUsername(dto.username, false);
  //   if (!user) {
  //     throw new NotFoundException("Username not found");
  //   }
  //   if (user.role !== UserRole.Patient) {
  //     throw new ForbiddenException("Only patient account allowed");
  //   }
  //   user = await this.userService.findById(user.id, true);
  //   const resetPasswordKyc = this.resetPasswordKycRepository.create({
  //     patient: user.patient,
  //     newPassword: dto.newPassword,
  //   });
  //   const newReset = await this.resetPasswordKycRepository.save(resetPasswordKyc);
  //   return { resetPasswordId: newReset.id };
  // }

  // async approveResetPassword(id: number): Promise<void> {
  //   const resetPasswordKYC = await this.resetPasswordKycRepository
  //     .createQueryBuilder("reset_password_kyc")
  //     .leftJoinAndSelect("reset_password_kyc.patient", "patient")
  //     .leftJoinAndSelect("patient.user", "user")
  //     .where("reset_password_kyc.id = :id", { id })
  //     .getOneOrFail();
  //   const updatedUser = this.userRepository.create(resetPasswordKYC.patient.user);
  //   const updatedPatient = this.patientRepository.create(resetPasswordKYC.patient);
  //   updatedUser.password = resetPasswordKYC.newPassword;
  //   updatedPatient.nationalIdImage = resetPasswordKYC.nationalIdImage;
  //   updatedPatient.selfieImage = resetPasswordKYC.selfieImage;
  //   updatedPatient.user = updatedUser;
  //   await this.patientRepository.save(updatedPatient);
  // }
  //
  // async rejectResetPassword(id: number): Promise<void> {
  //   await this.resetPasswordKycRepository.softDelete(id);
  // }

  // async uploadResetPasswordSelfieImage(id: number, image) {
  //   const resetPasswordKYC = await this.resetPasswordKycRepository
  //     .createQueryBuilder("reset_password_kyc")
  //     .leftJoinAndSelect("reset_password_kyc.patient", "patient")
  //     .leftJoinAndSelect("patient.user", "user")
  //     .where("reset_password_kyc.id = :id", { id })
  //     .getOneOrFail();
  //   const userId = resetPasswordKYC.patient.user.id;
  //   const path = `user_${userId}/reset-password/selfie_${Date.now()}.jpg`;
  //   resetPasswordKYC.selfieImage = await this.s3Service.uploadImage(image, path);
  //   await this.resetPasswordKycRepository.save(resetPasswordKYC);
  // }
  //
  // async uploadResetPasswordNationalIdImage(id: number, image) {
  //   const resetPasswordKYC = await this.resetPasswordKycRepository
  //     .createQueryBuilder("reset_password_kyc")
  //     .leftJoinAndSelect("reset_password_kyc.patient", "patient")
  //     .leftJoinAndSelect("patient.user", "user")
  //     .where("reset_password_kyc.id = :id", { id })
  //     .getOneOrFail();
  //   const userId = resetPasswordKYC.patient.user.id;
  //   const path = `user_${userId}/reset-password/national-id_${Date.now()}.jpg`;
  //   resetPasswordKYC.selfieImage = await this.s3Service.uploadImage(image, path);
  //   await this.resetPasswordKycRepository.save(resetPasswordKYC);
  // }
}
