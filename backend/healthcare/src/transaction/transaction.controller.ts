import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { Pagination } from "src/utils/pagination.util";
import { TransactionSearchDto, TransactionSearchResponseDto } from "./transaction.dto";
import { TransactionService } from "./transaction.service";

@ApiBearerAuth()
@ApiTags("Transaction")
@UseGuards(RolesGuard)
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Roles(UserRole.Hospital)
  @Post("search")
  async search(
    @UserId() userId,
    @Body() dto: TransactionSearchDto
  ): Promise<Pagination<TransactionSearchResponseDto>> {
    return this.transactionService.search(userId, dto);
  }
}
