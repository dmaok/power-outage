import { Module } from '@nestjs/common';
import { SendPushController } from './send-push.controller';
import { StatsModule } from '../stats/stats.module';
import { BotModule } from '../../telegram-bot/bot.module';

@Module({
  imports: [StatsModule, BotModule],
  controllers: [SendPushController],
})
export class SendPushModule {}
