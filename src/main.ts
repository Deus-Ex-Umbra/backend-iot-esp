import { NestFactory } from '@nestjs/core';
import { AppModulo } from './app.modulo';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModulo);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
  console.log('Servidor corriendo en puerto 3000');
}
bootstrap();