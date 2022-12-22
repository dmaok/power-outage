import { Controller, Post } from '@nestjs/common';
import { StatsService } from '../stats/stats.service';
import { PING_INTERVAL } from '../../constants';
import { BotService } from '../../telegram-bot/bot.service';
import { DatabaseService } from '../../db/database.service';

@Controller('api/tasks/trigger-push')
export class SendPushController {
  constructor(
    private readonly statsService: StatsService,
    private readonly tgBot: BotService,
    private readonly dbService: DatabaseService,
  ) {
  }

  @Post()
  async checkAndNotify() {
    const timeNow = new Date().getTime();
    const flats = await this.dbService.db.collection('flats').doc('lomo').get();
    const lastStatus: 'ON' | 'OFF' = flats.get('lastStatus');

    const latestPing = await this.statsService.getLastItem();
    if (latestPing.size) {
      const record = latestPing.docs['0'];
      let update: 'ON' | 'OFF';

      console.log({ timeNow, time: record.get('time') });
      if (timeNow - record.get('time') > PING_INTERVAL * 1.1) {
        update = 'OFF';
      } else {
        update = 'ON';
      }
      console.log(update);

      if (update !== lastStatus) {
        await this.dbService.db
          .collection('flats')
          .doc('lomo')
          .set({ lastStatus: update });
        await this.tgBot.sendPush(update);
      }
    }
    return 'Ok';
  }
}