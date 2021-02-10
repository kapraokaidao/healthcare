import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";

export class CreateServiceDto {
  @ApiProperty()
  assetCode: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

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
