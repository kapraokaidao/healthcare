import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private readonly smsServiceUrl: string;
  private readonly endpoint: string;
  private readonly enable: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.enable = this.configService.get<boolean>("sms.enable");
    this.smsServiceUrl = this.configService.get<string>("sms.serviceUrl");
    this.endpoint = new URL("/sms/send", this.smsServiceUrl).href;
  }

  sendSms(to: string, message: string): void {
    const phoneRegex = /0[0-9]{9}/;
    if (!this.enable || !phoneRegex.test(to)) return;
    this.httpService.post(this.endpoint, { to, message }).toPromise();
  }
}
