import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";

export class AuthCredentialsDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class PatientAuthCredentialsDto extends AuthCredentialsDto {
  @ApiProperty()
  @Length(13)
  @IsNumberString()
  username: string;

  @ApiProperty()
  @Length(6)
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
