import { ApiProperty } from "@nestjs/swagger";

export class AuthCredentialsDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
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
