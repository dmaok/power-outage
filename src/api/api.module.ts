import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { StatsModule } from './stats/stats.module';
import { SendPushModule } from './tasks/send-push.module';

@Module({
  imports: [
    PingModule,
    StatsModule,
    SendPushModule
  ],
})
export class ApiModule {}
