import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { StellarService } from "./stellar.service";
import { PublicAPI } from "../decorators/public-api.decorator";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { IssueTokenDto, transferTokenDto } from "./stellar.dto";
import { Horizon } from "stellar-sdk";
import BalanceLine = Horizon.BalanceLine;

@PublicAPI()
@ApiTags("Stellar")
@Controller("stellar")
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get("balance")
  @ApiQuery({ name: "publicKey", schema: { type: "string" }, required: true })
  @ApiQuery({ name: "name", schema: { type: "string" }, required: false })
  @ApiQuery({ name: "issuingPublicKey", schema: { type: "string" }, required: false })
  async getBalanceBySecret(@Query("publicKey") qPublicKey, @Query("name") qName, @Query("issuingPublicKey") qIssuingPublicKey): Promise<BalanceLine[]> {
    if(!qName || !qIssuingPublicKey){
      qName = null;
      qIssuingPublicKey = null;
    }
    return await this.stellarService.getBalance(qPublicKey, qName, qIssuingPublicKey);
  }

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
