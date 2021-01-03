import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "../entities/patient.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

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
    const user = patient.user
    delete patient.user
    user["patient"] = patient
    return user;
  }
}