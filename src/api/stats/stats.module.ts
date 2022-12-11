import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
