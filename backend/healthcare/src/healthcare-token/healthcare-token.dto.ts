import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";

export class HealthcareTokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  token_type: TokenType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  totalToken: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  startAge: number;

  @ApiProperty()
  endAge: number;

  @ApiProperty()
  gender: UserGender;

  @ApiProperty()
  tokenPerPerson: number;

  issuingPublicKey: string;

  receivingPublicKey: string;
}
