import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { UserRole } from '../constant/enum/user.enum';
import { Hospital } from '../entities/hospital.entity';
import { NHSO } from '../entities/nhso.entity';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
    @InjectRepository(NHSO)
    private readonly nhsoRepository: Repository<NHSO>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async find(conditions = {}): Promise<User[]> {
    return this.userRepository.find(conditions);
  }

  async findById(id: number, role = false): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (role) {
      switch (user.role) {
        case UserRole.NHSO:
          return this.userRepository.findOne(id, { relations: ['nhso'] });
        case UserRole.Hospital:
          return this.userRepository.findOne(id, { relations: ['hospital'] });
        case UserRole.Patient:
          return this.userRepository.findOne(id, { relations: ['patient'] });
      }
    }
    return user;
  }

  async findOne(conditions): Promise<User> {
    return this.userRepository.findOne(conditions);
  }

  async findByUsername(username: string, password?: boolean): Promise<User> {
    const query = this.userRepository.createQueryBuilder();
    query.where('username = :username', { username });
    if (password) {
      query.addSelect('password', 'User_password');
    }
    return query.getOne();
  }

  @Transaction()
  async create(
    user: User,
    @TransactionManager() entityManager?: EntityManager
  ): Promise<User> {
    const newUser = this.userRepository.create(user);
    switch (user.role) {
      case UserRole.Hospital:
        let hospital = await this.hospitalRepository.findOne(user.hospital);
        if (!hospital) {
          hospital = this.hospitalRepository.create(user.hospital);
        }
        newUser.hospital = hospital;
        hospital.user = newUser;
        await entityManager.save(hospital);
        await entityManager.save(newUser);
        return newUser;

      case UserRole.NHSO:
        const nhso = this.nhsoRepository.create(user.nhso);
        newUser.nhso = nhso;
        nhso.user = newUser;
        await entityManager.save(nhso);
        await entityManager.save(newUser);
        return newUser;

      case UserRole.Patient:
        let patient = await this.patientRepository.findOne({
          nationalId: user.patient.nationalId,
        });
        if (patient) {
          throw new BadRequestException("Duplicate Patient's National ID");
        }
        patient = this.patientRepository.create(user.patient);
        newUser.patient = patient;
        patient.user = newUser;
        await entityManager.save(patient);
        await entityManager.save(newUser);
        return newUser;

      default:
        throw new BadRequestException("Invalid user's role");
    }
  }
}
