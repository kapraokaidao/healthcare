import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private readonly smsServiceUrl: string;
  private readonly endpoint: string
  
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.smsServiceUrl = this.configService.get<string>("smsServiceUrl");
    this.endpoint = (new URL('/sms/send', this.smsServiceUrl)).href;
  }

  sendSms(to: string, message: string): void {
    const phoneRegex = /0[0-9]{9}/;
    if (!phoneRegex.test(to)) return;
    this.httpService.post(this.endpoint, {to, message}).toPromise();
  }
}
