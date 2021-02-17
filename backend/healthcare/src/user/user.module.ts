import { Global, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserController } from "./user.controller";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { Agency } from "../entities/agency.entity";
import { S3Module } from "../s3/s3.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Agency, Hospital, NHSO, Patient, ResetPasswordKYC]),
    S3Module,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
