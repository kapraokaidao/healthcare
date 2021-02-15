import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Fetus } from "src/entities/fetus.entity";
import { FetusController } from "./fetus.controller";
import { FetusService } from "./fetus.service";

@Module({
  imports: [TypeOrmModule.forFeature([Fetus])],
  controllers: [FetusController],
  providers: [FetusService],
  exports: [FetusService],
})
export class FetusModule {}
