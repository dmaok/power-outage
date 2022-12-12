import { Injectable } from '@nestjs/common';
import { Firestore, QuerySnapshot } from '@google-cloud/firestore';
import { join } from 'path';

@Injectable()
export class DatabaseService {
  private readonly instance: Firestore;

  get db() {
    return this.instance;
  }

  constructor() {
    console.log('create DatabaseService');
    this.instance = new Firestore({
      projectId: 'power-outage-371309',
      keyFilename: join(__dirname, '..', '..', 'credentials', 'power-outage-sa.json'),
    });
  }

  async getAll(collection) {
    return this.toArray(await this.db.collection(collection).get());
  }

  write(collection, data) {
    const dbCollection = this.db.collection(collection);
    return dbCollection.add(data);
  }

  private toArray(snapshot: QuerySnapshot) {
    const response = [];
    snapshot.forEach(item => response.push(item.data()));
    return response;
  }
}