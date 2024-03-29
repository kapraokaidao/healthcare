import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StellarService } from "./stellar.service";
import { PublicAPI } from "../decorators/public-api.decorator";
import { ApiTags } from "@nestjs/swagger";
import { IssueTokenDto, transferTokenDto } from "./stellar.dto";
import { Horizon } from "stellar-sdk";
import BalanceLine = Horizon.BalanceLine;

@PublicAPI()
@ApiTags("Stellar")
@Controller("stellar")
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Post("service")
  async issueToken(
    @Body() dto: IssueTokenDto
  ): Promise<{ issuingPublicKey: string; receivingPublicKey: string }> {
    return this.stellarService.issueToken(
      dto.issueingSecret,
      dto.receivingSecret,
      dto.serviceName,
      dto.amount
    );
  }
}
