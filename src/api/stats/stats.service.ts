import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';

@Injectable()
export class StatsService {
  constructor(private dbService: DatabaseService) {}

  async getStats() {
    const collection = await this.dbService.getAll('pings');
    const response = collection.map(item => ({
      ...item,
      light: true
    }));
    return response.sort((a, b) => a.time - b.time);
  }
}
