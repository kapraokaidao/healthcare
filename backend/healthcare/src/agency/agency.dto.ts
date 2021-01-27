import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "src/constant/enum/user.enum";

export class CreateServiceDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    description: string;
  
    @ApiProperty()
    totalToken: number;
  
    @ApiProperty()
    startDate: Date;
  
    @ApiProperty()
    endDate: Date;
  
    @ApiProperty()
    startAge: number;
  
    @ApiProperty()
    endAge: number;
  
    @ApiProperty()
    gender: UserGender;
  
    @ApiProperty()
    tokenPerPerson: number;

    @ApiProperty()
    issuingPublicKey: string;
  }

  export class AddMemberDto {
      @ApiProperty()
      nationalId: string

      @ApiProperty()
      notifiedUrl: string

      @ApiProperty()
      serviceId: number
  }

  export class ConfirmTransferDto {
      @ApiProperty()
      nationalId: string

      @ApiProperty()
      serviceId: number
  }