import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { Transaction } from "src/entities/transaction.entity";
import { RolesGuard } from "src/guards/roles.guard";
import { Pagination } from "src/utils/pagination.util";
import { isBetween } from "../utils/number.util";
import {
  TransactionSearchDto,
  TransactionSearcHistoryhDto,
  TransactionSearchResponseDto,
} from "./transaction.dto";
import { TransactionService } from "./transaction.service";

@ApiBearerAuth()
@ApiTags("Transaction")
@UseGuards(RolesGuard)
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Roles(UserRole.Patient)
  @Get("")
  async findTokens(@UserId() userId): Promise<Transaction[]> {
    return this.transactionService.findTokens(userId);
  }

  @Roles(UserRole.HospitalAdmin)
  @Post("search/group-by-service")
  async searchGroupByService(
    @UserId() userId,
    @Body() dto: TransactionSearchDto
  ): Promise<TransactionSearchResponseDto[]> {
    return this.transactionService.searchGroupByService(userId, dto);
  }

  @Roles(UserRole.Hospital, UserRole.HospitalAdmin)
  @Post("search/history")
  async searchHistory(
    @UserId() userId,
    @Body() dto: TransactionSearcHistoryhDto
  ): Promise<Pagination<any>> {
    const page = Number.isInteger(dto.page) && dto.page > 0 ? dto.page : 1;
    const pageSize = isBetween(dto.pageSize, 0, 1001) ? dto.pageSize : 100;
    return this.transactionService.searchHistory(userId, dto, { page, pageSize });
  }
}
