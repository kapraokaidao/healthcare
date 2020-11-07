import { Controller, Get, Param } from '@nestjs/common';
import { StellarService } from './stellar.service';

@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get(':id')
  findHello(@Param('id') id): string {
    return this.stellarService.hello(id);
  }
}
