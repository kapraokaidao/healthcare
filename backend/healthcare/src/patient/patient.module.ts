import { HttpModule, Module } from "@nestjs/common";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "../entities/patient.entity";
import { User } from "../entities/user.entity";
import { S3Module } from "../s3/s3.module";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { AuthModule } from "../auth/auth.module";
import { KeypairModule } from "src/keypair/keypair.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Patient, ResetPasswordKYC]),
    S3Module,
    AuthModule,
    KeypairModule,
    HttpModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
