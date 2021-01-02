import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto, AuthResponseDto, ChangePasswordDto } from "./auth.dto";
import { User } from "../entities/user.entity";
import { compareSync } from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser({
    username,
    password,
  }: AuthCredentialsDto): Promise<Omit<User, "password">> {
    const user: User = await this.userService.findByUsername(username, true);
    if (user && compareSync(password, user.password)) {
      const { password, ...userDto } = user;
      return userDto;
    }
    return null;
  }

  async login(credential: AuthCredentialsDto): Promise<AuthResponseDto> {
    const user: Omit<User, "password"> = await this.validateUser(credential);
    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }
    const access_token = this.jwtService.sign({ user });
    return { access_token };
  }

  async register(user: User): Promise<AuthResponseDto> {
    const existedUser = await this.userService.findByUsername(user.username);
    if (existedUser) {
      throw new BadRequestException("Username already existed");
    }
    await this.userService.create(user);
    return this.login({ username: user.username, password: user.password });
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const { newPassword, ...authDto } = dto;
    const user: Omit<User, "password"> = await this.validateUser(authDto);
    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }
    user["password"] = newPassword;
    await this.userRepository.save(user);
  }
}
