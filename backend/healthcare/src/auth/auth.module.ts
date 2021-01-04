import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { S3Service } from "../s3/s3.service";
import { Patient } from "../entities/patient.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, Patient, ResetPasswordKYC]),
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: "7d",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, S3Service],
})
export class AuthModule {}
