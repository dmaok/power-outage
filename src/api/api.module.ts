import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    PingModule,
    StatsModule
  ],
})
export class ApiModule {}
