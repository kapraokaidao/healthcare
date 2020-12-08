import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { Hospital } from '../entities/hospital.entity';
import { NHSO } from '../entities/nhso.entity';
import { Patient } from '../entities/patient.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Hospital, NHSO, Patient])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
