import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { PublicAPI } from '../decorators/public-api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountResponse, IssueTokenDto } from './stellar.dto';
import { Horizon } from 'stellar-sdk';
import BalanceLine = Horizon.BalanceLine;

@PublicAPI()
@ApiTags('Stellar')
@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Post('account')
  async createAccount(): Promise<CreateAccountResponse> {
    return await this.stellarService.createAccount();
  }

  @Get('balance/:secret')
  async getBalanceBySecret(@Param('secret') secret: string): Promise<BalanceLine[]> {
    return await this.stellarService.getBalanceBySecret(secret);
  }

  @Post('service')
  async issueToken(@Body() dto: IssueTokenDto): Promise<void> {
    return this.stellarService.issueToken(
      dto.issueingSecret,
      dto.receivingSecret,
      dto.serviceName,
      dto.amount
    );
  }
}
