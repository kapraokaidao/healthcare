import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/constant/enum/user.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { Fetus } from 'src/entities/fetus.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateFetusDto, FetusGroupByDateResponse } from './fetus.dto';
import { FetusService } from './fetus.service';


@ApiBearerAuth()
@ApiTags("Fetus")
@Controller('fetus')
@UseGuards(RolesGuard)
export class FetusController {
    constructor(private readonly fetusService: FetusService) {}

    @Post()
    @Roles(UserRole.Patient)
    async create(@UserId() userId: number, @Body() dto: CreateFetusDto): Promise<Fetus> {
        return this.fetusService.create(userId, dto.amount, dto.weight);
    }

    @Get("/group-by-date")
    @Roles(UserRole.Patient)
    async findGroupByDate(@UserId() userId: number): Promise<FetusGroupByDateResponse[]> {
        return this.fetusService.findGroupByDate(userId);
    }

}
