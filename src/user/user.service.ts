import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sendmail } from 'src/@helpers/mail';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}
  //   Update UserActivity
  async updateUserActivity(user: User) {
    user.lastActivity = new Date();
    await this.dataSource.getRepository(User).save(user);
  }

  //   Cron Job for checking inactive user
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const users = await this.dataSource
      .getRepository(User)
      .find({ where: { lastActivity: LessThan(fifteenDaysAgo) } });
    for (const user of users) {
      const message = `<h4>Hello ${user.username}, You are not active for recent 15 days, Wanna give access of space to others.</h4>`;

      sendmail({
        to: user.email,
        subject: 'Give access to Others?',
        html: message,
      });
      // Creating reminder object
      const reminder = new Reminder();
      reminder.message = message;
      reminder.user_id = user.id;

      // Saving Reminder
      await this.dataSource.getRepository(Reminder).save(reminder);
    }
  }
}
