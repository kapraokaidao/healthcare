import { Global, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserController } from "./user.controller";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";
import { S3Service } from "../s3/s3.service";
import { PatientService } from "./patient.service";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Hospital, NHSO, Patient])],
  controllers: [UserController],
  providers: [UserService, PatientService, S3Service],
  exports: [UserService, PatientService],
})
export class UserModule {}
