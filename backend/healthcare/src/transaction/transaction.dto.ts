import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TxType } from "src/constant/enum/transaction.enum";

export class TransactionSearchDto {
  @ApiProperty({ type: "enum", enum: TxType })
  @IsEnum(TxType)
  type: TxType;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({ required: false })
  name: string;
}

export class TransactionSearcHistoryhDto {
  @ApiProperty({ type: "enum", enum: TxType })
  @IsEnum(TxType)
  type: TxType;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;
}

export class TransactionSearchResponseDto {
  id: number;
  name: string;
  amount: number;
}
