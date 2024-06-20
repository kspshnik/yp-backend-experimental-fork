import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { YpWebsocketsModule } from './yp-websockets.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(YpWebsocketsModule, {
    transport: Transport.REDIS,
  });
}
bootstrap();
