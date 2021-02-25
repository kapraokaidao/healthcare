import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "src/entities/patient.entity";
import { Repository } from "typeorm";
import { HealthDto, UpdateHealthDto } from "./health.dto";

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async view(userId: number): Promise<HealthDto> {
    const user = await this.patientRepository.findOne(userId);
    const BMI = (user.weight / (user.height / 100)) ^ 2;
    return { ...user, BMI };
  }

  async update(userId: number, updateHealthDto: UpdateHealthDto): Promise<HealthDto> {
    const user = await this.patientRepository.findOne(userId);
    for (const key in updateHealthDto) {
      user[key] = updateHealthDto[key];
    }
    await this.patientRepository.save(user);
    const BMI = (user.weight / (user.height / 100)) ^ 2;
    return { ...user, BMI };
  }
}
