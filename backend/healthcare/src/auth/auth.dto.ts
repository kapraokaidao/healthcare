import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, Length } from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class PatientAuthCredentialsDto extends AuthCredentialsDto {
  @ApiProperty()
  @Length(13, 13)
  @IsNumberString()
  username: string;

  @ApiProperty()
  @Length(6, 6)
  @IsNumberString()
  password: string;
}

export class AuthResponseDto {
  access_token: string;
}

export class ChangePasswordDto extends AuthCredentialsDto {
  @ApiProperty()
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  newPassword: string;
}
