import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { PublicAPI } from '../decorators/public-api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IssueTokenDto } from './stellar.dto';

@PublicAPI()
@ApiTags('Stellar')
@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get('account')
  async createAccount() {
    return await this.stellarService.createAccount();
  }

  @Get('balance/:secret')
  async getBalanceBySecret(
    @Param('secret') secret: string
  ): Promise<string> {
    return await this.stellarService.getBalanceBySecret(secret);
  }

  @Post('service')
  async issueToken(
    @Body() dto: IssueTokenDto
  ): Promise<string>{
    return this.stellarService.issueToken(dto.issueingSecret, dto.receivingSecret, dto.serviceName, dto.amount);
  }
}
