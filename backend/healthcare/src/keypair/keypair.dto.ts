import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";

export class CreateKeypairDto {
  @ApiProperty()
  @Length(6)
  @IsNumberString()
  pin: string;
}

export class IsActiveResponseDto {
  isActive: boolean;
}

export class ChangePinDto {
  @ApiProperty()
  @Length(6)
  @IsNumberString()
  currentPin: string;

  @ApiProperty()
  @Length(6)
  @IsNumberString()
  newPin: string;
}
