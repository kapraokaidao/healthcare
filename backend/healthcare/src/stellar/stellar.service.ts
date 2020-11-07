import { Injectable } from '@nestjs/common';

@Injectable()
export class StellarService {
  hello(id: string) {
    return `hello ${id}`;
  }
}
