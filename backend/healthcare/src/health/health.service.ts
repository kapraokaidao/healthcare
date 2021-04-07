import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "src/entities/patient.entity";
import { Repository } from "typeorm";
import { HealthDto, PregnantDto, UpdateHealthDto } from "./health.dto";

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  private calculateWeight(bmi: number, height: number) {
    return bmi / (height / 100) ** 2;
  }

  async view(userId: number): Promise<HealthDto> {
    const user = await this.patientRepository.findOne(userId);
    const BMI = user.weight / (user.height / 100) ** 2;
    return { ...user, BMI };
  }

  async update(userId: number, updateHealthDto: UpdateHealthDto): Promise<HealthDto> {
    const user = await this.patientRepository.findOne(userId);
    for (const key in updateHealthDto) {
      user[key] = updateHealthDto[key];
    }
    await this.patientRepository.save(user);
    const BMI = user.weight / (user.height / 100) ** 2;
    return { ...user, BMI };
  }

  async getPregnant(userId: number): Promise<PregnantDto> {
    const user = await this.patientRepository.findOne(userId);

    const BMI = user.startPregnantWeight / (user.startPregnantHeight / 100) ** 2;
    const underWeight = this.calculateWeight(18.5, user.startPregnantHeight);
    const normalWeight = this.calculateWeight(24.9, user.startPregnantHeight);
    return {
      startPregnantHeight: user.startPregnantHeight,
      startPregnantWeight: user.startPregnantWeight,
      BMI,
      recommend: `เกณฑ์น้ำหนักมาตรฐาน ${underWeight.toFixed(2)} - ${normalWeight.toFixed(
        2
      )} กิโลกรัม`,
    };
  }
}
