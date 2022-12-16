import gcpDebug from '@google-cloud/debug-agent';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

gcpDebug.start({ serviceContext: { enableCanary: true } });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const PORT = Number(process.env.PORT) || 8080;
  await app.listen(PORT);
}
bootstrap();
