import { Controller, Get } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('api/ping')
export class PingController {
  constructor(private pingService: PingService) {}

  @Get()
  async ping() {
    await this.pingService.writePing();
    return 'Ok';
  }
}
