import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";
import { Hospital } from "src/entities/hospital.entity";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { IsEnum, IsNumberString, Length, Min } from "class-validator";
import { ToInt } from "class-sanitizer";

export class HealthcareTokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsEnum(TokenType)
  tokenType: TokenType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @ToInt()
  @Min(0)
  totalToken: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @ToInt()
  @Min(0)
  startAge: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  endAge: number;

  @ApiProperty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @ToInt()
  @Min(0)
  tokenPerPerson: number;
}

export class ServiceAndPinDto {
  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  @Length(6)
  @IsNumberString()
  pin: string;
}

export class CreateSpecialTokenRequestDto extends ServiceAndPinDto {
  @ApiProperty()
  userId: number;
}

export class CreateRedeemRequestDto extends CreateSpecialTokenRequestDto {
  @ApiProperty()
  @ToInt()
  @Min(0)
  amount: number;
}


export class WithdrawDto extends ServiceAndPinDto {
  @ApiProperty()
  @ToInt()
  @Min(0)
  amount: number;
}

export class Slip {
  transactionId: string;

  sourcePublicKey: string;

  destinationPublicKey: string;

  amount: number;

  hospital: Hospital;

  healthcareToken: HealthcareToken;
}
