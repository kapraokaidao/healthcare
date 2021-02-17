import { Module } from "@nestjs/common";
import configuration from "./config/configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StellarModule } from "./stellar/stellar.module";
import { HealthcareTokenModule } from "./healthcare-token/healthcare-token.module";
import { HospitalModule } from "./hospital/hospital.module";
import { KeypairModule } from "./keypair/keypair.module";
import { TransactionModule } from "./transaction/transaction.module";
import { ConstantModule } from "./constant/constant.module";
import { AgencyModule } from "./agency/agency.module";
import { FetusModule } from "./fetus/fetus.module";
import { PatientModule } from "./patient/patient.module";
import { S3Module } from "./s3/s3.module";
import { SmsModule } from "./sms/sms.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === "production",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("db.host"),
        port: configService.get<number>("db.port"),
        username: configService.get<string>("db.username"),
        password: configService.get<string>("db.password"),
        database: configService.get<string>("db.database"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("nodeEnv") === "development",
      }),
    }),
    AuthModule,
    UserModule,
    StellarModule,
    HealthcareTokenModule,
    HospitalModule,
    KeypairModule,
    TransactionModule,
    ConstantModule,
    AgencyModule,
    FetusModule,
    PatientModule,
    S3Module,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
