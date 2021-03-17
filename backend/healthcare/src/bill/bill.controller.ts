import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { Bill } from "src/entities/bill.entity";
import { RolesGuard } from "src/guards/roles.guard";
import { BillDetailResponse, CreateBillDto, SearchBillDto } from "./bill.dto";
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
  // @Roles(UserRole.NHSO)
  @Roles(UserRole.HospitalAdmin)
  async searchBill(@Body() dto: SearchBillDto): Promise<Bill[]> {
    return this.billService.searchBill(dto);
  }

  @Get("/:id")
  // @Roles(UserRole.NHSO)
  @Roles(UserRole.HospitalAdmin)
  async getBillDetails(@Param("id") id: number): Promise<BillDetailResponse> {
    return this.billService.getBillDetails(id);
  }


  // @Get("/bill-detail/:id")
  // // @Roles(UserRole.NHSO)
  // @Roles(UserRole.HospitalAdmin)
  // async getTransactionsFromBillDetailId(@Param("id") id: number): Promise<> {

  // }
}
