import { Module } from '@nestjs/common';
import { YpBlobServiceController } from './yp-blob-service.controller';
import { YpBlobServiceService } from './yp-blob-service.service';

@Module({
  imports: [],
  controllers: [YpBlobServiceController],
  providers: [YpBlobServiceService],
})
export class YpBlobServiceModule {}
