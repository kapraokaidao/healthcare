import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenType } from 'src/constant/enum/token.enum';
import { HealthcareToken } from 'src/entities/healthcare-token.entity';
import { Member } from 'src/entities/member.entity';
import { Patient } from 'src/entities/patient.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddMemberDto, CreateServiceDto } from './agency.dto';

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
        @InjectRepository(HealthcareToken) private readonly healthcareTokenRepository: Repository<HealthcareToken>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
        private readonly userService: UserService
    ){}

    async findMyServices(userId: number): Promise<HealthcareToken[]> {
        return this.healthcareTokenRepository.find({where: {createdBy: {id: userId}}});
    }

    async createService(userId: number, dto: CreateServiceDto): Promise<HealthcareToken>{
        const user = await this.userService.findById(userId);
        const newHealthcareToken = this.healthcareTokenRepository.create(dto);
        newHealthcareToken.tokenType = TokenType.General;
        newHealthcareToken.isActive = true;
        newHealthcareToken.remainingToken = dto.totalToken;
        newHealthcareToken.createdBy = user;
        newHealthcareToken.issuingPublicKey = dto.issuingPublicKey;
        return this.healthcareTokenRepository.save(newHealthcareToken);
    }

    async addMember(userId: number, dto: AddMemberDto): Promise<Member>{
        const agency = await this.userService.findById(userId);
        const patient = await this.patientRepository.findOneOrFail({nationalId: dto.nationalId}, {relations: ["user"]});
        const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(dto.serviceId, {relations: ["createdBy"]});
        if(healthcareToken.createdBy.id !== userId){
            throw new BadRequestException(`Service id ${dto.serviceId} wasn't created by you`);
        }
        const existedMember = await this.memberRepository.findOne({where: {patient: {id: patient.user.id}, healthcareToken: {id: dto.serviceId}}});
        if(existedMember){
            throw new BadRequestException(`${dto.nationalId} is already a member of service id ${dto.serviceId}`);
        }
        const newMember = this.memberRepository.create();
        newMember.agency = agency;
        newMember.healthcareToken = healthcareToken;
        newMember.notifiedUrl = dto.notifiedUrl;
        newMember.patient = patient.user;
        newMember.transferred = false;
        return this.memberRepository.save(newMember);
    }
}
