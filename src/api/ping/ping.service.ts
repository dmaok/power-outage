import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 } from 'uuid';

@Injectable()
export class PingService {
  constructor(private databaseService: DatabaseService) {}

  writePing() {
    return this.databaseService.write('pings', this.createRecord());
  }

  private createRecord() {
    const timeNow = new Date().getTime();
    return {
      id: v4(),
      time: timeNow,
    };
  }
}
