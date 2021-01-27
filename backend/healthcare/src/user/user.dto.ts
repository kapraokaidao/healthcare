import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { KycQueryType } from "../constant/enum/kyc.enum";

export class SearchUsersDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  user: Partial<User>;
}

export class KYC {
  type: KycQueryType.Register | KycQueryType.ResetPassword;
  id: number;
  user: User;
  nationalIdImage: string;
  selfieImage: string;
}
