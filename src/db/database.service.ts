import { Global, Injectable } from '@nestjs/common';
import { Firestore, QuerySnapshot } from '@google-cloud/firestore';
import { join } from 'path';

@Global()
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

  async getLatest(collection: string, orderBy) {
    return await this.db.collection(collection)
      .orderBy(orderBy, 'asc')
      .limitToLast(1)
      .get();
  }

  write<T>(collection: string, data: T) {
    const dbCollection = this.db.collection(collection);
    return dbCollection.add(data);
  }

  private toArray(snapshot: QuerySnapshot) {
    const response = [];
    snapshot.forEach(item => response.push(item.data()));
    return response;
  }
}