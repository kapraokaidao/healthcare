import { BadRequestException, Injectable } from "@nestjs/common";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { Patient } from "../entities/patient.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PatientInfoUpdateDto } from "./patient.dto";
import { User } from "../entities/user.entity";
import { UserRole } from "../constant/enum/user.enum";
import { UserService } from "../user/user.service";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findPatientByUserId(id: number): Promise<Patient> {
    const query = await this.patientRepository.createQueryBuilder("p");
    query.where("user_id = :user", { user: id });
    return query.getOne();
  }

  async update(userId: number, dto: PatientInfoUpdateDto): Promise<Patient> {
    const patient: Patient = await this.findPatientByUserId(userId);
    return patient;
  }

  async findById(id: number, relation?: boolean): Promise<Patient> {
    if (relation) {
      return this.patientRepository.findOneOrFail(id, { relations: ["user"] });
    } else {
      return this.patientRepository.findOneOrFail(id);
    }
  }

  getUserObject(patient: Patient): User {
    // receive: patient with key user
    // return : user with key patient
    if (!patient.user) {
      throw new Error("Patient object not containing user object");
    }
    const user = patient.user;
    delete patient.user;
    user["patient"] = patient;
    return user;
  }

  // TODO: if unused delete this code (consult team about where to put register patient API)
  // @Transaction()
  // async create(
  //   user: User,
  //   @TransactionManager() entityManager?: EntityManager
  // ): Promise<User> {
  //   if (user.role !== UserRole.Patient) {
  //     throw new BadRequestException("Invalid role")
  //   }
  //   const newUser = this.userRepository.create(UserService.excludeUserRoleFields(user));
  //   let patient = await this.patientRepository.findOne({
  //     nationalId: user.patient.nationalId,
  //   });
  //   if (patient) {
  //     throw new BadRequestException("Duplicate Patient's National ID");
  //   }
  //   patient = this.patientRepository.create(user.patient);
  //   patient.user = newUser;
  //   await entityManager.save(patient);
  //   return newUser;
  // }
}
