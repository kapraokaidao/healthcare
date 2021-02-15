import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";
import { BloodRh, BloodType } from "../constant/enum/patient.enum";
import { ApiProperty } from "@nestjs/swagger";

export class PatientInfoUpdateDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(300)
  weight: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(300)
  height: number;

  @ApiProperty({ type: "enum", enum: BloodType })
  @IsEnum(BloodType)
  bloodType: BloodType;

  @ApiProperty({ type: "enum", enum: BloodRh })
  @IsEnum(BloodRh)
  bloodRh: BloodRh;

  @ApiProperty()
  // @IsString()
  allergies: string;

  @ApiProperty()
  @IsString()
  medications: string;
}
