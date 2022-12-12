import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

@Module({
  imports: [DbModule],
  controllers: [PingController],
  providers: [PingService],
})
export class PingModule {}
