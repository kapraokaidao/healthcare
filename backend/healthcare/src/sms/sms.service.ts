import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private readonly smsServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.smsServiceUrl = this.configService.get<string>("smsServiceUrl");
  }

  async sendSms(to: string, message: string): Promise<void> {
    const phoneRegex = /0[0-9]{9}/;
    if (!phoneRegex.test(to)) return;
    await this.httpService.post(this.smsServiceUrl, { to, message });
  }
}
