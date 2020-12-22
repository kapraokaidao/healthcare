import { ApiProperty } from "@nestjs/swagger";

export class createKeypairDto {
  @ApiProperty()
  pin: string;
}
