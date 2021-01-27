import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { StellarModule } from "./stellar/stellar.module";
import { HealthcareTokenModule } from "./healthcare-token/healthcare-token.module";
import { HospitalModule } from "./hospital/hospital.module";
import { KeypairModule } from "./keypair/keypair.module";
import { TransactionModule } from "./transaction/transaction.module";
import { ConstantModule } from "./constant/constant.module";
import { AgencyModule } from "./agency/agency.module";

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
        synchronize: configService.get<string>("node_env") !== "production",
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
