import { Module } from "@nestjs/common";
import { HealthcareTokenController } from "./healthcare-token.controller";
import { HealthcareTokenService } from "./healthcare-token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { StellarService } from "src/stellar/stellar.service";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HealthcareToken, User])],
  controllers: [HealthcareTokenController],
  providers: [HealthcareTokenService, StellarService],
})
export class HealthcareTokenModule {}
