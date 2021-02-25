import { ApiProperty } from "@nestjs/swagger";
import { ToInt } from "class-sanitizer";
import { IsEnum, Min } from "class-validator";
import { BloodType } from "src/constant/enum/patient.enum";

export class HealthDto {
  weight: number;
  height: number;
  bloodType: BloodType;
  systolic: number;
  diastolic: number;
  hearthRate: number;
  temperature: number;
  BMI: number;
  pregnantBMI: number;
}

export class UpdateHealthDto {
  @ApiProperty()
  @ToInt()
  @Min(0)
  weight?: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  height?: number;

  @ApiProperty()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiProperty()
  @ToInt()
  @Min(0)
  systolic?: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  diastolic?: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  hearthRate?: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  temperature?: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  pregnantBMI?: number;
}
