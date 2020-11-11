import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { UserRole } from "../constant/enum/user.enum";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";

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

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
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
  async create(user: User, @TransactionManager() entityManager?: EntityManager): Promise<User> {
    const newUser = this.userRepository.create(user);
    switch (user.role) {
      case UserRole.Hospital:
        const hospital = this.hospitalRepository.create(user.hospital);
        newUser.hospital = hospital;
        hospital.user = newUser;
        await entityManager.save(newUser);
        await entityManager.save(hospital);
        return newUser

      case UserRole.NHSO:
        const nhso = this.nhsoRepository.create(user.nhso);
        newUser.nhso = nhso;
        nhso.user = newUser;
        await entityManager.save(newUser);
        await entityManager.save(nhso);
        return newUser

      case UserRole.Patient:
        const patient = this.patientRepository.create(user.patient);
        newUser.patient = patient;
        patient.user = newUser;
        await entityManager.save(newUser);
        await entityManager.save(patient);
        return newUser

      default: throw new BadRequestException("Invalid role")
    }
  }
}
