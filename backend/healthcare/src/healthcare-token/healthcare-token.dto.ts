import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";
import { Hospital } from "src/entities/hospital.entity";
import { HealthcareToken } from "src/entities/healthcare-token.entity";

export class HealthcareTokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  tokenType: TokenType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  totalToken: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  startAge: number;

  @ApiProperty()
  endAge: number;

  @ApiProperty()
  gender: UserGender;

  @ApiProperty()
  tokenPerPerson: number;
}

export class CreateSpecialTokenRequestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  pin: string;
}

export class CreateRedeemRequestDto extends CreateSpecialTokenRequestDto {
  @ApiProperty()
  amount: number;
}

export class ServiceAndPinDto {
  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  pin: string;
}

export class WithdrawDto extends ServiceAndPinDto {
  @ApiProperty()
  destinationPublicKey: string;

  @ApiProperty()
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
