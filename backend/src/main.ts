import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exceptions.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

   app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
    },
  });

  app.startAllMicroservices().catch((err) => {
    console.error('Error starting microservices:', err);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
