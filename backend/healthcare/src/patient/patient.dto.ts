import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";
import { BloodRh, BloodType } from "../constant/enum/patient.enum";
import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";

export class PatientRegisterDto {
  @ApiProperty()
  @IsNumberString()
  @Length(13, 13)
  nationalId: string;

  @ApiProperty()
  @IsNumberString()
  @Length(6, 6)
  pin: string;

  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @Matches(/0[0-9]{9}/)
  phone: string;

  @ApiProperty()
  @Matches(/\d{6}/)
  otp: string;

  @ApiProperty()
  @Matches(/[A-Z0-9]{6}/)
  ref: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: "enum", enum: UserGender })
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  birthDate: Date;
}

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
