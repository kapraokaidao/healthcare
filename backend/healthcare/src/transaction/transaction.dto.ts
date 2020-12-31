import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "src/constant/enum/transaction.enum";

export class TransactionSearchDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({ required: false })
  name: string;
}

export class TransactionSearchResponseDto {
  id: number;

  name: string;

  amount: number;
}
