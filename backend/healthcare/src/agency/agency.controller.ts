import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/constant/enum/user.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { HealthcareToken } from 'src/entities/healthcare-token.entity';
import { Member } from 'src/entities/member.entity';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddMemberDto, ConfirmTransferDto, CreateServiceDto } from './agency.dto';
import { AgencyService } from './agency.service';

@ApiBearerAuth()
@ApiTags("Agency")
@Controller('agency')
@UseGuards(RolesGuard)
export class AgencyController {
    constructor(private readonly agencyService: AgencyService){}

    @Get('my-service')
    @Roles(UserRole.Agency)
    async findMyService(@UserId() userId): Promise<HealthcareToken[]>{
        return this.agencyService.findMyServices(userId);
    }
    
    @Post('create-service')
    @Roles(UserRole.Agency)
    async createService(@UserId() userId, @Body() dto: CreateServiceDto): Promise<HealthcareToken>{
        return this.agencyService.createService(userId, dto);
    }

    @Post('add-member')
    @Roles(UserRole.Agency)
    async addMember(@UserId() userId, @Body() dto: AddMemberDto): Promise<Member> {
        return this.agencyService.addMember(userId, dto);
    }

    @Post("confirm-transfer")
    @Roles(UserRole.Agency)
    async confirmTransfer(@UserId() userId, @Body() dto: ConfirmTransferDto): Promise<void> {
        return this.agencyService.confirmTransfer(userId, dto.serviceId, dto.nationalId);
    }
}
