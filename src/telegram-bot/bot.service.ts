import { Global, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { DatabaseService } from '../db/database.service';
import { HttpService } from '@nestjs/axios';

const hayThere = `
<bold>Hi there! You are subscribed to the lights switches on Lomonosova 71z</bold>
type <span>/unsubscribe</span> to leave
`;

const bayText = `
You won't receive notifications. You can always type <span>/start</span> to re resubscribe
`;

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
    const message = status === 'ON' ?
      `💡🟨️Yay! Ми знову зі світлом! ⚡` :
      `🌚⬛️От халепа! \n Світла знову нема`;

    subscribersQuery.forEach(subscriber => {
      const chatId = subscriber.get('chatId');
      this.httpService.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        'chat_id': chatId,
        'text': message,
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
    if (this.bot) return;

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

  private async unsubscribeUser(chatId: number) {
    const doc = await this.dbService.db
      .collection(this.tableName)
      .where('chatId', '==', chatId)
      .get();
    return doc.forEach(doc => doc.ref.delete());
  }

  private addListeners() {
    console.log('addListeners');
    this.bot.command('start', async (ctx) => {
      const chatId = ctx.update.message.chat.id;
      const subscribed = await this.isUserSubscribed(chatId);

      if (!subscribed) {
        await this.subscribeUser(chatId);
      }
      await ctx.reply(hayThere, {
        parse_mode: 'HTML'
      });
    });

    this.bot.command('unsubscribe', async (ctx) => {
      const chatId = ctx.update.message.chat.id;
      const subscribed = await this.isUserSubscribed(chatId);

      if (subscribed) {
        await this.unsubscribeUser(chatId);
      }
      await ctx.reply(bayText, {
        parse_mode: 'HTML'
      });
    });
  }
}
