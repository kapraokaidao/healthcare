import { ApiProperty } from "@nestjs/swagger";
import { ToInt } from "class-sanitizer";
import { IsNumberString, Length, Min } from "class-validator";

export class WithdrawItem {
  @ApiProperty()
  @ToInt()
  serviceId: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  amount: number;
}

export class CreateBillDto {
  @ApiProperty()
  @Length(6)
  @IsNumberString()
  pin: string;

  @ApiProperty({ type: [WithdrawItem] })
  withdrawItems: WithdrawItem[];
}

export class SearchBillDto {
  @ApiProperty()
  @Length(9, 9)
  @IsNumberString()
  hospitalCode: string;

  @ApiProperty()
  serviceName: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @ToInt()
  page: number;

  @ApiProperty()
  @ToInt()
  pageSize: number;
}

export class SearchBillResponse {
  id: number;

  hospitalName: string;

  services: ServiceItem[];

  createdDate: Date;
}

export class ServiceItem {
  billDetailId: number;

  serviceName: string;

  amount: number;
}

export class LineItem {
  id: number;

  firstname: string;

  lastname: string;

  amount: number;

  effectiveDate: Date;
}
