import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // A global pipeline for allowing validation on classes
  app.useGlobalPipes(
    new ValidationPipe()
  )
  app.enableCors();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
