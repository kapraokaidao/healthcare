import { ApiProperty } from "@nestjs/swagger";
import { Hospital } from "../entities/hospital.entity";

export class SearchHospitalDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  hospital: Partial<Hospital>;
}
