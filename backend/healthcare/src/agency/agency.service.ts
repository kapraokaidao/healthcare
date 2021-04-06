import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { TokenType } from "src/constant/enum/token.enum";
import { HealthcareToken } from "src/entities/healthcare-token.entity";
import { Member } from "src/entities/member.entity";
import { Patient } from "src/entities/patient.entity";
import { UserToken } from "src/entities/user-token.entity";
import { KeypairService } from "src/keypair/keypair.service";
import { StellarService } from "src/stellar/stellar.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { AddMemberDto, CreateServiceDto } from "./agency.dto";

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly userService: UserService,
    private readonly keypairService: KeypairService,
    private readonly stellarService: StellarService
  ) {}

  async findMyServices(userId: number): Promise<HealthcareToken[]> {
    return this.healthcareTokenRepository.find({ where: { createdBy: { id: userId } } });
  }

  async createService(userId: number, dto: CreateServiceDto): Promise<HealthcareToken> {
    const user = await this.userService.findById(userId);
    const newHealthcareToken = this.healthcareTokenRepository.create(dto);
    newHealthcareToken.tokenType = TokenType.General;
    newHealthcareToken.isActive = true;
    newHealthcareToken.totalToken = 1;
    newHealthcareToken.remainingToken = 1;
    newHealthcareToken.createdBy = user;
    newHealthcareToken.issuingPublicKey = dto.issuingPublicKey;
    return this.healthcareTokenRepository.save(newHealthcareToken);
  }

  async addMember(userId: number, dto: AddMemberDto): Promise<Member> {
    const agency = await this.userService.findById(userId);
    const patient = await this.patientRepository.findOneOrFail(
      { nationalId: dto.nationalId },
      { relations: ["user"] }
    );
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(
      dto.serviceId,
      { relations: ["createdBy"] }
    );
    if (healthcareToken.createdBy.id !== userId) {
      throw new BadRequestException(`Service id ${dto.serviceId} wasn't created by you`);
    }
    const existedMember = await this.memberRepository.findOne({
      where: { patient: { id: patient.user.id }, healthcareToken: { id: dto.serviceId } },
    });
    if (existedMember) {
      throw new BadRequestException(
        `${dto.nationalId} is already a member of service id ${dto.serviceId}`
      );
    }
    const newMember = this.memberRepository.create();
    newMember.agency = agency;
    newMember.healthcareToken = healthcareToken;
    newMember.notifiedUrl = dto.notifiedUrl;
    newMember.recoveryUrl = dto.recoveryUrl;
    newMember.patient = patient.user;
    newMember.transferred = false;
    return this.memberRepository.save(newMember);
  }

  async confirmTransfer(
    userId: number,
    serviceId: number,
    nationalId: string
  ): Promise<void> {
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const patient = await this.patientRepository.findOneOrFail(
      { nationalId: nationalId },
      { relations: ["user"] }
    );
    const member = await this.memberRepository.findOneOrFail({
      where: { patient: { id: patient.user.id }, healthcareToken: { id: serviceId } },
    });
    if (member.transferred === true) {
      throw new BadRequestException("Transfer was already confirmed");
    }
    const publicKey = await this.keypairService.findPublicKey(patient.user.id, userId);
    const stellarBalance = await this.stellarService.getBalance(
      publicKey,
      healthcareToken.assetCode,
      healthcareToken.issuingPublicKey
    );
    if (!stellarBalance || parseInt(stellarBalance["balance"]) <= 0) {
      throw new BadRequestException("Token haven't been transferred yet");
    }
    member.transferred = true;
    await this.userTokenRepository.update(
      { user: { id: patient.user.id }, healthcareToken: { id: serviceId } },
      { balance: parseInt(stellarBalance["balance"]), isReceived: true }
    );
    await this.memberRepository.save(member);
  }

  async notifyAddedTrustline(
    userId: number,
    serviceId: number,
    publicKey: string
  ): Promise<void> {
    const user = await this.userService.findById(userId, true);
    const healthcareToken = await this.healthcareTokenRepository.findOneOrFail(serviceId);
    const member = await this.memberRepository.findOne({
      where: { patient: { id: userId }, healthcareToken: { id: serviceId } },
    });
    axios.post(member.notifiedUrl, {
      nationalId: user.patient.nationalId,
      service: healthcareToken,
      publicKey: publicKey,
    });
  }
}
