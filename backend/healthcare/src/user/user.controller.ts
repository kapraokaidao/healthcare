import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserId } from '../decorators/user-id.decorator';
import { User } from '../entities/user.entity';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constant/enum/user.enum';
import { Pagination } from '../utils/pagination';

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
  @Get()
  @ApiQuery({ name: 'page', schema: { type: 'integer' }, required: true })
  @ApiQuery({ name: 'pageSize', schema: { type: 'integer' }, required: true })
  @ApiQuery({ name: 'role', schema: { type: 'string' }, required: false, enum: UserRole })
  async findAll(
    @Query('page') qPage: string,
    @Query('pageSize') qPageSize: string,
    @Query('role') qRole: UserRole
  ): Promise<Pagination<User>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const conditions = qRole ? { role: qRole } : {};
    return this.userService.findAll(conditions, { page, pageSize });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.NHSO)
  @Post()
  async createUser(@UserId() id: number, @Body() user: User): Promise<User> {
    const newUser = await this.userService.create(user);
    return this.userService.findById(newUser.id, true);
  }
}
