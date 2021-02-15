import { Module } from "@nestjs/common";
import { HospitalController } from "./hospital.controller";
import { HospitalService } from "./hospital.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hospital } from "../entities/hospital.entity";
import { UserModule } from "../user/user.module";
import { User } from "../entities/user.entity";
import { KeypairModule } from "src/keypair/keypair.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Hospital]), UserModule, KeypairModule],
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
