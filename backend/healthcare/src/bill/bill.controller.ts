import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { Bill } from "src/entities/bill.entity";
import { RolesGuard } from "src/guards/roles.guard";
import { Pagination } from "src/utils/pagination.util";
import { CreateBillDto, LineItem, SearchBillDto, ServiceItem } from "./bill.dto";
import { BillService } from "./bill.service";

@ApiBearerAuth()
@ApiTags("Bill")
@Controller("bill")
@UseGuards(RolesGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @Roles(UserRole.HospitalAdmin)
  async createBill(@UserId() userId, @Body() dto: CreateBillDto): Promise<void> {
    return this.billService.createBill(userId, dto);
  }

  @Post("search")
  @Roles(UserRole.NHSO, UserRole.HospitalAdmin)
  async searchBill(
    @UserId() userId,
    @Body() dto: SearchBillDto
  ): Promise<Pagination<Bill>> {
    return this.billService.searchBill(userId, dto);
  }

  @Get("/:id")
  @Roles(UserRole.NHSO, UserRole.HospitalAdmin)
  async getBillDetails(@UserId() userId, @Param("id") id: number): Promise<ServiceItem[]> {
    return this.billService.getBillDetails(userId, id);
  }

  @Get("/detail/:id")
  @Roles(UserRole.NHSO, UserRole.HospitalAdmin)
  @ApiQuery({ name: "page", schema: { type: "integer" }, required: true })
  @ApiQuery({ name: "pageSize", schema: { type: "integer" }, required: true })
  async getTransactionsFromBillDetailId(
    @UserId() userId: number,
    @Param("id") id: number,
    @Query("page") qPage: string,
    @Query("pageSize") qPageSize: string
  ): Promise<Pagination<LineItem>> {
    const page = qPage ? parseInt(qPage) : 1;
    const pageSize = qPageSize ? parseInt(qPageSize) : 10;
    return this.billService.getBillDetailLines(userId, id, { page, pageSize });
  }
}
