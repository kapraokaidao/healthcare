import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, Length } from "class-validator";
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

export class SearchTransactionNHSODto {
  @ApiProperty({required: false})
  @Length(9, 9)
  @IsNumberString()
  hospitalCode: string;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({ required: false })
  serviceName: string;

  @ApiProperty({ required: false })
  firstname: string;

  @ApiProperty({ required: false })
  lastname: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

}

export class SearchTransactionNHSOResponse {
  id: number

  firstname: string

  lastname: string

  serviceName: string

  amount: number

  createdDate: Date

  hospitalName: string
}