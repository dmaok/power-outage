import { Controller, Post } from '@nestjs/common';
import { StatsService } from '../stats/stats.service';
import { PING_INTERVAL } from '../../constants';
import { BotService } from '../../telegram-bot/bot.service';

@Controller('api/tasks/trigger-push')
export class SendPushController {
  private lastStatus: 'ON' | 'OFF' = 'ON';

  constructor(
    private readonly statsService: StatsService,
    private readonly tgBot: BotService
    ) {}

  @Post()
  async checkAndNotify() {
    const timeNow = new Date().getTime();
    const latestPing = await this.statsService.getLastItem();
    if (latestPing.size) {
      latestPing.forEach(record => {
        let update: 'ON' | 'OFF';
        console.log({timeNow, time: record.get('time')});
        if (timeNow - record.get('time') > PING_INTERVAL) {
          update = 'OFF';
        } else {
          update = 'ON';
        }
        console.log(update);
        if (update !== this.lastStatus) {
          this.lastStatus = update;
          this.tgBot.sendPush(update);
        }
      });

    } else {
      return 'Ok'
    }
  }
}