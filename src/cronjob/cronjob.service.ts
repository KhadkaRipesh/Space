import { Injectable } from '@nestjs/common';
import { DataSource, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sendmail } from 'src/@helpers/mail';
import { Share } from 'src/space/entities/share.entity';
import { Space } from 'src/space/entities/space.entity';
import { User } from 'src/user/entities/user.entity';
import { Reminder } from 'src/user/entities/reminder.entity';
import { defaultMailTemplate } from 'src/@helpers/mail-templates/default.mail-template';

@Injectable()
export class CronjobService {
  constructor(private readonly dataSource: DataSource) {}

  //   Cron Job for checking inactive user
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const fifteenDaysAgo = new Date();

    // Checking user last activity since 15 days
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Getting user data, not active since 15 days
    const users = await this.dataSource.getRepository(User).find({
      where: { lastActivity: LessThan(fifteenDaysAgo), hasExpired: false },
    });

    for (const user of users) {
      const space = await this.dataSource
        .getRepository(Space)
        .findOne({ where: { user_id: user.id } });

      // If user has their space
      if (space) {
        const isShare = await this.dataSource
          .getRepository(Share)
          .findOne({ where: { space_id: space.id } });

        //   If user shares any space then,
        if (isShare) {
          // Getting reminder data
          const hasReminder = await this.dataSource
            .getRepository(Reminder)
            .findOne({ where: { user_id: user.id } });

          // If there is no reminder for user or user respond to previous reminder
          if (!hasReminder || hasReminder.hasResponed === true) {
            const message = `<h4>Hello ${user.username}, You are not active for recent 15 days, Wanna give access of space to others?,
                If no, Go online.</h4>`;

            // Send Mail
            sendmail({
              to: user.email,
              subject: 'Sharing Access to Shared Email Account',
              html: defaultMailTemplate({
                title: 'Sharing Access to Shared Email Account',
                name: user.username,
                message: `You haven't logged in for 15 days. Unless you log in soon, sharing settings will reset automatically.`,
              }),
            });

            // Creating reminder object
            const reminder = new Reminder();
            reminder.message = message;
            reminder.user_id = user.id;
            reminder.hasResponed = false;

            // Saving Reminder
            await this.dataSource.getRepository(Reminder).save(reminder);
          }
        }
      }
    }
    return 'Created Reminder for creator.';
  }

  //   Cron job for not responding reminders
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron2() {
    const hoursToCheck = 42 * 60 * 60 * 1000; // converting to milliseconds
    // const hoursToCheck = 20 * 1000;

    // Getting unresponed reminder
    const reminders = await this.dataSource
      .getRepository(Reminder)
      .find({ where: { hasResponed: false } });

    //   If reminder exists
    if (reminders.length > 0) {
      for (const reminder of reminders) {
        const currentDate = new Date();
        const createdDate = reminder.createdAt;
        const timeDiff = currentDate.getTime() - createdDate.getTime();

        // Checking time difference between current and created time of remainder with hours to check
        if (timeDiff >= hoursToCheck) {
          // Get user from the reminder
          const user = await this.dataSource
            .getRepository(User)
            .findOne({ where: { id: reminder.user_id } });
          if (user) {
            // Expire the inactive user
            user.hasExpired = true;

            // save the current user
            await this.dataSource.getRepository(User).save(user);

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
                html: defaultMailTemplate({
                  title: 'Got Space Access',
                  name: share.email,
                  message: `You can access the space now. Signup and Accept the invitation.`,
                }),
              });
            }
            // Delete the reminder
            await this.dataSource.getRepository(Reminder).remove(reminder);
            return { mesage: 'Invited sucessflly for full access.', shares };
          }
        }
      }
    }
  }
}
