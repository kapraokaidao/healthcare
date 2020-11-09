import { ApiProperty } from '@nestjs/swagger';

export class IssueTokenDto {
 @ApiProperty ()
 issueingSecret: string;

 @ApiProperty ()
 receivingSecret: string;

 @ApiProperty ()
 serviceName: string;

 @ApiProperty ()
 amount: number;
}