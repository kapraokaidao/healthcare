import { Module } from "@nestjs/common";
import { AgencyService } from "./agency.service";
import { AgencyController } from "./agency.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "src/entities/patient.entity";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { Member } from "src/entities/member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Patient, HealthcareToken, Member])],
  providers: [AgencyService],
  controllers: [AgencyController],
})
export class AgencyModule {}
