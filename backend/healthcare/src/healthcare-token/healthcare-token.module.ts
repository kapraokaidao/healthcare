import { Module } from '@nestjs/common';
import { HealthcareTokenController } from './healthcare-token.controller';
import { HealthcareTokenService } from './healthcare-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthcareToken } from '../entities/healthcare-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthcareToken])],
  controllers: [HealthcareTokenController],
  providers: [HealthcareTokenService],
})
export class HealthcareTokenModule {}
