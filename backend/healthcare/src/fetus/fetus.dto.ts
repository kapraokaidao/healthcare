import { ApiProperty } from "@nestjs/swagger";
import { ToInt } from "class-sanitizer";
import { Min } from "class-validator";

export class CreateFetusDto {
  @ApiProperty()
  @ToInt()
  @Min(0)
  amount: number;

  @ApiProperty()
  @ToInt()
  @Min(0)
  weight: number;
}

export class FetusGroupByDateResponse {
  date: string;

  amount: number;

  weight: number;
}
