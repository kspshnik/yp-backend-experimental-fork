import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { YpBlobServiceModule } from './yp-blob-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(YpBlobServiceModule, {
    transport: Transport.REDIS,
  });
}
bootstrap();
