import { BadRequestException, Injectable } from "@nestjs/common";
import { HealthcareToken } from "../entities/healthcare-token.entity";
import { HealthcareTokenDto } from "./healthcare-token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pagination, PaginationOptions } from "../utils/pagination";

@Injectable()
export class HealthcareTokenService {

  constructor(
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>,
  ) {}

  async find(
    conditions,
    pageOptions: PaginationOptions
  ): Promise<Pagination<HealthcareToken>> {
    const t = await this.healthcareTokenRepository.createQueryBuilder("ht");
    const [tokens, totalCount] = await this.healthcareTokenRepository.findAndCount({
      where: {
        ...conditions,
      },
      take: pageOptions.pageSize,
      skip: (pageOptions.page - 1) * pageOptions.pageSize,
    });
    const pageCount = Math.ceil(totalCount / pageOptions.pageSize);
    return {
      data: tokens,
      itemCount: tokens.length,
      page: pageOptions.page,
      pageSize: pageOptions.pageSize,
      totalCount,
      pageCount,
    };
  }

  async createToken(dto: HealthcareTokenDto): Promise<HealthcareToken> {
    const newToken = await this.healthcareTokenRepository.create(dto);
    const startTime = new Date(dto.startTime);
    newToken.startBirthdate = dto.endAge ? new Date(startTime.getFullYear() - dto.endAge, 0, 1, 7): null;
    newToken.endBirthdate = dto.startAge ? new Date(startTime.getFullYear() - dto.startAge, 11, 31, 7): null;
    return this.healthcareTokenRepository.save(newToken);
  }

  async deactivateToken(id: number): Promise<HealthcareToken> {
    const token = await this.healthcareTokenRepository.findOne(id);
    if(!token){
      throw new BadRequestException(`Token id '${id} is not found'`);
    }
    token.isActive = false;
    return this.healthcareTokenRepository.save(token);
  }

  async isExisted(dto: HealthcareTokenDto): Promise<boolean> {
    const existedToken = await this.healthcareTokenRepository.findOne({ name: dto.name });
    return !!existedToken;
  }
}
