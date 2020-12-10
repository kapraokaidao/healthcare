import { BadRequestException, Injectable } from '@nestjs/common';
import { HealthcareToken } from '../entities/healthcare-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination, PaginationOptions } from '../utils/pagination';

@Injectable()
export class HealthcareTokenService {
  constructor(
    @InjectRepository(HealthcareToken)
    private readonly healthcareTokenRepository: Repository<HealthcareToken>
  ) {}

  async find(
    conditions,
    pageOptions: PaginationOptions
  ): Promise<Pagination<HealthcareToken>> {
    const t = await this.healthcareTokenRepository.createQueryBuilder('ht');
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

  async createToken(dto: HealthcareToken): Promise<HealthcareToken> {
    const existedToken = await this.healthcareTokenRepository.findOne({ name: dto.name });
    if (existedToken) {
      throw new BadRequestException(`Token name '${dto.name} is already existed'`);
    }
    const newToken = await this.healthcareTokenRepository.create(dto);
    return this.healthcareTokenRepository.save(newToken);
  }
}
