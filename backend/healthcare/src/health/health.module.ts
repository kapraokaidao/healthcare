import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Patient } from "src/entities/patient.entity";
import { User } from "src/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient]), UserModule, AuthModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
