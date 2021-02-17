import { Module } from "@nestjs/common";
import { KeypairService } from "./keypair.service";
import { KeypairController } from "./keypair.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Keypair } from "src/entities/keypair.entity";
import { StellarService } from "src/stellar/stellar.service";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Keypair, User])],
  providers: [KeypairService, StellarService],
  controllers: [KeypairController],
  exports: [KeypairService],
})
export class KeypairModule {}
