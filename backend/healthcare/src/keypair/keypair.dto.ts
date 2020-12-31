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
  oldPin: string;

  @ApiProperty()
  newPin: string;
}
