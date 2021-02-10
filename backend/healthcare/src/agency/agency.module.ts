import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { HealthcareToken } from 'src/entities/healthcare-token.entity';
import { Member } from 'src/entities/member.entity';
import { StellarService } from 'src/stellar/stellar.service';
import { KeypairModule } from 'src/keypair/keypair.module';
import { UserToken } from 'src/entities/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, HealthcareToken, Member, UserToken]), KeypairModule],
  providers: [AgencyService, StellarService],
  controllers: [AgencyController],
  exports: [AgencyService]
})
export class AgencyModule {}