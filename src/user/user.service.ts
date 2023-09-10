import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sendmail } from 'src/@helpers/mail';
import { Reminder } from './entities/reminder.entity';
import { Share } from 'src/space/entities/share.entity';
import { ResponseReminderDto } from './dto/reminder.dto';
import { EditProfileDto } from './dto/user.dto';
import { Space } from 'src/space/entities/space.entity';

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
      const space = await this.dataSource
        .getRepository(Space)
        .findOne({ where: { user_id: user.id } });

      if (space) {
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
    return 'Created Reminder for creator.';
  }

  // Cron job for not responding reminders

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron2() {
    const hoursToCheck = 42 * 60 * 60 * 1000;
    const reminders = await this.dataSource
      .getRepository(Reminder)
      .find({ where: { hasResponed: false } });

    for (const reminder of reminders) {
      const currentDate = new Date();
      const createdDate = reminder.createdAt;

      const timeDiff = currentDate.getTime() - createdDate.getTime();
      if (timeDiff >= hoursToCheck) {
        // Get user from the reminder
        const user = await this.dataSource
          .getRepository(User)
          .findOne({ where: { id: reminder.user_id } });

        // Get the shared information from the user
        const shares = await this.dataSource
          .getRepository(Share)
          .find({ where: { user_id: user.id } });

        // Give access to all user
        for (const share of shares) {
          share.hasAccess = true;
          await this.dataSource.getRepository(Share).save(share);

          sendmail({
            to: share.email,
            subject: 'Got Space Access',
            html: `<p>You can access the space now.</p><br>
                  <h4>Signup and Accept the invitation.</h4>`,
          });
        }
      }
    }
  }
  
  async responseToReminder(id: string, payload: ResponseReminderDto) {
    const { giveAccess } = payload;
    const reminder = await this.dataSource
      .getRepository(Reminder)
      .findOne({ where: { id: id } });
    if (giveAccess === 'yes') {
      await this.dataSource.getRepository(Reminder).remove(reminder);
    }
  }

  async editProfile(id: string, user: User, payload: EditProfileDto) {
    const { username, email } = payload;
    console.log(payload);
    const getUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: id } });
    if (!getUser)
      throw new BadRequestException('User with this id is not found.');

    if (getUser) {
      (getUser.username = username), (getUser.email = email);
    }
    return await this.dataSource.getRepository(User).save(getUser);
  }
}
