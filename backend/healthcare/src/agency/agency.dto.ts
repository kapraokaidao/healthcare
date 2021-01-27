import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, Length, Min } from "class-validator";
import { UserGender } from "src/constant/enum/user.enum";

export class CreateServiceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @Min(0)
  totalToken: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @Min(0)
  startAge: number;

  @ApiProperty()
  @Min(0)
  endAge: number;

  @ApiProperty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @Min(0)
  tokenPerPerson: number;

  @ApiProperty()
  issuingPublicKey: string;
}

export class AddMemberDto {
  @ApiProperty()
  @Length(13)
  @IsNumberString()
  nationalId: string;

  @ApiProperty()
  notifiedUrl: string;

  @ApiProperty()
  serviceId: number;
}

export class ConfirmTransferDto {
  @ApiProperty()
  @Length(13)
  @IsNumberString()
  nationalId: string;

  @ApiProperty()
  serviceId: number;
}
