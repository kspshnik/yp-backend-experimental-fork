import { NestFactory } from '@nestjs/core';
import { YpBlobServiceModule } from './yp-blob-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
     YpBlobServiceModule,
     {
       transport: Transport.REDIS,
     }
   )
}
bootstrap();
