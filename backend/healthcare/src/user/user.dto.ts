import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";

export class SearchUsersDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  user: Partial<User>;
}

export class KYC {
  type: "RegisterKyc" | "ResetPasswordKyc";
  id: number;
  user: User;
  nationalIdImage: string;
  selfieImage: string;
  // userId: number;
  // resetPasswordId: number;
}

export enum KycImageType {
  NationalId = "nationalIdImage",
  Selfie = "selfieImage",
}

export enum KycQueryType {
  All = "All",
  Register = "RegisterKyc",
  ResetPassword = "ResetPasswordKyc",
}
