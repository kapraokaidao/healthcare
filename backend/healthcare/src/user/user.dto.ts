import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class SearchUsersDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  user: Partial<User>;
}

export enum KycImageType {
  NationalId = "nationalIdImage",
  Selfie = "selfieImage",
}
