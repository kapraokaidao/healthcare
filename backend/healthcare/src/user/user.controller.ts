import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.NHSO, UserRole.Hospital, UserRole.Patient)
  @Get('me')
  async me(@UserId() id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @Roles(UserRole.NHSO, UserRole.Hospital, UserRole.Patient)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id, true);
  }

  @Roles(UserRole.NHSO)
  @Get()
  @ApiQuery({ name: 'page', schema: { type: 'integer' }, required: true })
  @ApiQuery({ name: 'pageSize', schema: { type: 'integer' }, required: true })
  @ApiQuery({ name: 'role', schema: { type: 'string' }, required: false, enum: UserRole })
  @ApiQuery({ name: 'firstname', schema: { type: 'string' }, required: false })
  @ApiQuery({ name: 'surname', schema: { type: 'string' }, required: false })
  async findAll(
    @Query('page') qPage: string,
    @Query('pageSize') qPageSize: string,
    @Query('role') qRole: UserRole,
    @Query('firstname') qFirstname: string,
    @Query('surname') qSurname: string
  ): Promise<Pagination<User>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    const conditions = {};
    if (qRole) conditions['role'] = qRole;
    if (qFirstname) conditions['firstname'] = qFirstname;
    if (qSurname) conditions['surname'] = qSurname;
    return this.userService.find(conditions, { page, pageSize });
  }

  @Roles(UserRole.NHSO)
  @Post()
  async createUser(@UserId() id: number, @Body() user: User): Promise<User> {
    const newUser = await this.userService.create(user);
    return this.userService.findById(newUser.id, true);
  }

  @Roles(UserRole.NHSO)
  @Get('deleted')
  async findSoftDeletedUsers(): Promise<User[]> {
    return this.userService.findSoftDeletedUsers();
  }

  @Roles(UserRole.NHSO)
  @Delete(':id')
  async softDeleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.softDelete(id);
  }

  @Roles(UserRole.NHSO)
  @Delete(':id/permanent')
  async hardDeleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.hardDelete(id);
  }

  @Roles(UserRole.NHSO)
  @Post(':id/restore')
  async restore(@Param('id') id: number): Promise<void> {
    await this.userService.restore(id);
  }
}
