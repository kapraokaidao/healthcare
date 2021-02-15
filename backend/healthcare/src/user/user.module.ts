import { forwardRef, Global, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserController } from "./user.controller";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";
import { S3Service } from "../s3/s3.service";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { Agency } from "../entities/agency.entity";
import { PatientModule } from "../patient/patient.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Agency, Hospital, NHSO, Patient, ResetPasswordKYC]),
    forwardRef(() => PatientModule),
  ],
  controllers: [UserController],
  providers: [UserService, S3Service],
  exports: [UserService],
})
export class UserModule {}
