import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";
import { User } from "src/entities/user.entity";
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

export class VerificationInfoDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  healthcareToken: HealthcareToken;
}

export class CreateTransferRequestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  amount: number;
}

export class ServiceAndPinDto {
  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  pin: string;
}
