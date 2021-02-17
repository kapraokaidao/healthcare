import { ApiProperty } from "@nestjs/swagger";
import { Hospital } from "../entities/hospital.entity";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { User } from "src/entities/user.entity";

export class SearchHospitalDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  hospital: Partial<Hospital>;
}

export class SearchHospitalAccountDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  user: Partial<User>;
}

export class CreateHospitalDto {
  @ApiProperty()
  @IsString()
  @Matches(/[A-Za-z]+[A-Za-z0-9-_]+[A-Za-z0-9]+/)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8)
  @Matches(/[A-Za-z0-9]+/)
  password: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsNumberString()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;
}
