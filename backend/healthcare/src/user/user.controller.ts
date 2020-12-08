import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserId } from '../decorators/user-id.decorator';
import { User } from '../entities/user.entity';
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../constant/enum/user.enum";

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@UserId() id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.NHSO)
  @Post()
  async createUser(@UserId() id: number, @Body() user: User): Promise<User> {
    const newUser = await this.userService.create(user);
    return this.userService.findById(newUser.id, true);
  }
}
