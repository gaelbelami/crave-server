import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // A global pipeline for allowing validation on classes
  app.useGlobalPipes(
    new ValidationPipe()
  )
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
