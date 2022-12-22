import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { join } from 'path';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { BotModule } from './telegram-bot/bot.module';

@Module({
  imports: [
    ApiModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(__dirname, './../log/info/'),
          filename: 'info.log',
        }),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'build'),
    }),
    BotModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('/api/*');
  }
}
