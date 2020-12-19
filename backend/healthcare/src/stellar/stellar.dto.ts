import { ApiProperty } from "@nestjs/swagger";

export class IssueTokenDto {
  @ApiProperty()
  issueingSecret: string;

  @ApiProperty()
  receivingSecret: string;

  @ApiProperty()
  serviceName: string;

  @ApiProperty()
  amount: number;
}

export class CreateAccountResponse {
  secret: string;
  publicKey: string;
}

export class transferTokenDto {
  @ApiProperty()
  sourceSecret: string;

  @ApiProperty()
  destinationSecret: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  issuerPublicKey: string;

  @ApiProperty()
  amount: number;
}
