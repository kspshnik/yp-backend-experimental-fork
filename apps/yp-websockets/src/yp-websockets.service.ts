import { Injectable } from '@nestjs/common';

@Injectable()
export class YpWebsocketsService {
  getHello(): string {
    return 'Hello World!';
  }
}
