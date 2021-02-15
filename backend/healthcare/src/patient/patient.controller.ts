import { Body, Controller, Patch, Post } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Patient } from "../entities/patient.entity";
import { UserId } from "../decorators/user-id.decorator";
import { PatientInfoUpdateDto } from "./patient.dto";

@ApiBearerAuth()
@ApiTags("Patient")
@Controller("patient")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Patch()
  async patchPatient(
    @UserId() id: number,
    @Body() dto: PatientInfoUpdateDto
  ): Promise<Patient> {
    return await this.patientService.update(id, dto);
  }
}
