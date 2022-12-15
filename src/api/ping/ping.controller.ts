import { Controller, Get, Query } from "@nestjs/common";
import { PingService } from './ping.service';

@Controller('api/ping')
export class PingController {
  constructor(private pingService: PingService) {}

  @Get()
  async ping(@Query('bundle') bundle?: number) {
    await this.pingService.writePing(bundle ?? 1);
    return 'Ok';
  }
}
