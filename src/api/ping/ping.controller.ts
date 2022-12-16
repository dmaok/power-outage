import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PingService } from './ping.service';
import { Logger } from 'winston';

@Controller('api/ping')
export class PingController {
  constructor(
    private pingService: PingService,
    @Inject('winston') private logger: Logger
  ) {}

  @Get()
  async ping(
    @Query('bundle') bundle?: number | string,
    // @Request() request: Request
    ) {
    const bundleCount = parseInt(bundle.toString() || '0');
    await this.pingService.writePing(bundleCount);
    return new Date().getTime();
  }
}
