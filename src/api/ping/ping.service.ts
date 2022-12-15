import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 } from 'uuid';
import { PING_INTERVAL } from '../../constants';
import { PingDto } from './ping.dto';

@Injectable()
export class PingService {
  constructor(private databaseService: DatabaseService) {}

  writePing(bundle: number): Promise<any[]> {
    const requests = [];
    for (let i = bundle; i > 0; i--) {
      const record = this.createRecord(i);
      requests.push(this.databaseService.write<PingDto>('pings', record));
    }
    return Promise.all(requests);
  }

  private createRecord(offset: number): PingDto {
    const timeOffset = (offset - 1) * PING_INTERVAL;
    const timeNow = new Date().getTime() - timeOffset;
    return {
      id: v4(),
      time: timeNow,
      online: offset === 1
    };
  }
}
