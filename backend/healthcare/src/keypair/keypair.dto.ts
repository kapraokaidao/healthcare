import { ApiProperty } from "@nestjs/swagger";

export class CreateKeypairDto {
  @ApiProperty()
  pin: string;
}

export class IsActiveResponseDto {
  isActive: boolean;
}

export class ChangePinDto {
  @ApiProperty()
  currentPin: string;

  @ApiProperty()
  newPin: string;
}
