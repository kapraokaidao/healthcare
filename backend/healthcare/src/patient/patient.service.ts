import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Patient } from "../entities/patient.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PatientInfoUpdateDto } from "./patient.dto";
import { User } from "../entities/user.entity";
import { RegisterStatus, UserRole } from "../constant/enum/user.enum";
import { UserService } from "../user/user.service";
import { KycImageType } from "../constant/enum/kyc.enum";
import { ChangePasswordDto, ResetPasswordDto } from "../auth/auth.dto";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { AuthService } from "../auth/auth.service";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class PatientService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetPasswordKYC)
    private readonly resetPasswordKycRepository: Repository<ResetPasswordKYC>
  ) {}

  async findPatientByUserId(id: number): Promise<Patient> {
    const query = await this.patientRepository.createQueryBuilder("p");
    query.where("user_id = :user", { user: id });
    return query.getOne();
  }

  async update(userId: number, dto: PatientInfoUpdateDto): Promise<Patient> {
    const patient: Patient = await this.findPatientByUserId(userId);
    return  this.patientRepository.save({ ...patient, ...dto });
  }

  async findById(id: number, relation?: boolean): Promise<Patient> {
    if (relation) {
      return this.patientRepository.findOneOrFail(id, { relations: ["user"] });
    } else {
      return this.patientRepository.findOneOrFail(id);
    }
  }

  async getRegisterStatus(id: number): Promise<RegisterStatus> {
    const user = await this.userService.findById(id, true);
    if (user.patient.approved) {
      return RegisterStatus.Complete;
    } else if (
      user.patient.nationalIdImage !== null &&
      user.patient.selfieImage !== null
    ) {
      return RegisterStatus.AwaitApproval;
    } else {
      return RegisterStatus.UploadKYC;
    }
  }

  async updateImage(id: number, image: any, imageType: KycImageType): Promise<void> {
    const imgPrefix = imageType === KycImageType.NationalId ? "national-id" : "selfie";
    const path = `user_${id}/kyc/${imgPrefix}_${Date.now()}.jpg`;
    const imageUrl = await this.s3Service.uploadImage(image, path);
    const user = await this.userRepository.findOne(id, { relations: ["patient"] });
    user.patient[imageType] = imageUrl;
    await this.patientRepository.save(user.patient);
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const { newPassword, ...authDto } = dto;
    const user: Omit<User, "password"> = await this.authService.validateUser(
      authDto,
      UserRole.Patient
    );
    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }
    user["password"] = newPassword;
    const updatedUser = this.userRepository.create(user);
    await this.userRepository.save(updatedUser);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ resetPasswordId: number }> {
    let user: User = await this.userService.findByUsername(dto.username, false);
    user = await this.userService.findById(user.id, true);
    const resetPasswordKyc = this.resetPasswordKycRepository.create({
      patient: user.patient,
      newPassword: dto.newPassword,
    });
    const newReset = await this.resetPasswordKycRepository.save(resetPasswordKyc);
    return { resetPasswordId: newReset.id };
  }

  async uploadResetPasswordSelfieImage(id: number, image) {
    const resetPasswordKYC = await this.resetPasswordKycRepository
      .createQueryBuilder("reset_password_kyc")
      .leftJoinAndSelect("reset_password_kyc.patient", "patient")
      .leftJoinAndSelect("patient.user", "user")
      .where("reset_password_kyc.id = :id", { id })
      .getOneOrFail();
    const userId = resetPasswordKYC.patient.user.id;
    const path = `user_${userId}/reset-password/selfie_${Date.now()}.jpg`;
    resetPasswordKYC.selfieImage = await this.s3Service.uploadImage(image, path);
    await this.resetPasswordKycRepository.save(resetPasswordKYC);
  }

  async uploadResetPasswordNationalIdImage(id: number, image) {
    const resetPasswordKYC = await this.resetPasswordKycRepository
      .createQueryBuilder("reset_password_kyc")
      .leftJoinAndSelect("reset_password_kyc.patient", "patient")
      .leftJoinAndSelect("patient.user", "user")
      .where("reset_password_kyc.id = :id", { id })
      .getOneOrFail();
    const userId = resetPasswordKYC.patient.user.id;
    const path = `user_${userId}/reset-password/national-id_${Date.now()}.jpg`;
    resetPasswordKYC.selfieImage = await this.s3Service.uploadImage(image, path);
    await this.resetPasswordKycRepository.save(resetPasswordKYC);
  }

  // TODO: if unused delete this code (consult team about where to put register patient API)
  // @Transaction()
  // async create(
  //   user: User,
  //   @TransactionManager() entityManager?: EntityManager
  // ): Promise<User> {
  //   if (user.role !== UserRole.Patient) {
  //     throw new BadRequestException("Invalid role")
  //   }
  //   const newUser = this.userRepository.create(UserService.excludeUserRoleFields(user));
  //   let patient = await this.patientRepository.findOne({
  //     nationalId: user.patient.nationalId,
  //   });
  //   if (patient) {
  //     throw new BadRequestException("Duplicate Patient's National ID");
  //   }
  //   patient = this.patientRepository.create(user.patient);
  //   patient.user = newUser;
  //   await entityManager.save(patient);
  //   return newUser;
  // }
}
