import { Global, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { DatabaseService } from '../db/database.service';
import { HttpService } from '@nestjs/axios';

@Global()
@Injectable()
export class BotService {
  private readonly tableName = 'tg-chats';
  private bot: Bot;

  constructor(
    private dbService: DatabaseService,
    private readonly httpService: HttpService
  ) {
    this.init();
  }

  async sendPush(status: 'ON' | 'OFF') {
    const { botToken } = require('../../credentials/telegram.json');
    const subscribersQuery = await this.dbService.db.collection(this.tableName).get();
    subscribersQuery.forEach(subscriber => {
      const chatId = subscriber.get('chatId');
      this.httpService.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        'chat_id': chatId,
        'text': 'Light is ' + status,
        'parse_mode': 'HTML'
      }).subscribe();
    });
  }

  async startBot() {
    this.bot.start();
    this.addListeners();
  }

  private async init() {
    const { botToken } = require('../../credentials/telegram.json');
    this.bot = new Bot(botToken);
    this.startBot();
  }

  private async isUserSubscribed(chatId: number) {
    const isSubscribed = await this.dbService.db
    .collection(this.tableName)
    .where('chatId', '==', chatId)
    .get();
    return !isSubscribed.empty;
  }

  private async subscribeUser(chatId: number) {
    return await this.dbService.db.collection(this.tableName).add({ chatId });
  }

  private addListeners() {
    console.log('addListeners');
    this.bot.command('start', async (ctx) => {
      const chatId = ctx.update.message.chat.id;
      // console.log(ctx);
      // console.log(ctx.update.message.chat);
      const subscribed = await this.isUserSubscribed(chatId);
      if (!subscribed) {
        await this.subscribeUser(chatId);
      }
      await ctx.reply('test', {
        parse_mode: 'HTML'
      });
    });
  }
}
