import { Controller, Get, Param } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { PublicAPI } from '../decorators/public-api.decorator';
import { ApiTags } from '@nestjs/swagger';

@PublicAPI()
@ApiTags('Stellar')
@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get('account')
  async createAccount(): Promise<string> {
    return await this.stellarService.createAccount();
  }

  @Get('balance/:secret')
  async getBalanceBySecret(@Param('secret') secret): Promise<string> {
    return await this.stellarService.getBalanceBySecret(secret);
  }
}
