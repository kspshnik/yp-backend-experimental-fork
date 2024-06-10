import { Controller, Get } from '@nestjs/common';
import { YpBlobServiceService } from './yp-blob-service.service';

@Controller()
export class YpBlobServiceController {
  constructor(private readonly ypBlobServiceService: YpBlobServiceService) {}

  @Get()
  getHello(): string {
    return this.ypBlobServiceService.getHello();
  }
}
