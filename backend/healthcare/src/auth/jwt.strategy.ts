import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "../entities/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret"),
    });
  }

  async validate(payload: { user: User; iat: number; exp: number }): Promise<User> {
    const { iat, exp, user } = payload;
    const passwordChangedDate = await this.userService.findPasswordChangedDate(user.id);
    if (passwordChangedDate.getTime() > iat * 1000) {
      throw new BadRequestException("Token Expired");
    }
    return user;
  }
}
