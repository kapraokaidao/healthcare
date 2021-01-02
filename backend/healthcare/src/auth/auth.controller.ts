import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto, ChangePasswordDto } from "./auth.dto";
import { User } from "../entities/user.entity";
import { PublicAPI } from "../decorators/public-api.decorator";

@PublicAPI()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential);
  }

  @Post("register")
  async register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post("change-password")
  async changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    await this.authService.changePassword(dto);
  }
}
