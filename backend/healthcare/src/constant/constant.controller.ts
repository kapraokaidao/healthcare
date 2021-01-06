import { Controller, Get } from "@nestjs/common";
import { PublicAPI } from "../decorators/public-api.decorator";
import { ConstantService } from "./constant.service";
import { UserRole } from "./enum/user.enum";
import { KycQueryType } from "./enum/kyc.enum";
import { ApiTags } from "@nestjs/swagger";

@PublicAPI()
@ApiTags("Constant")
@Controller("constant")
export class ConstantController {
  constructor(private readonly constantService: ConstantService) {}

  @Get("user-roles")
  getUserRoles() {
    return UserRole;
  }

  @Get("kyc/query-types")
  getKycQueryTypes() {
    return KycQueryType;
  }
}
