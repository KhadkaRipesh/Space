import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Reminder } from './entities/reminder.entity';
import { EditProfileDto } from './dto/user.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly dataSource: DataSource) {}
  //   Update UserActivity
  async updateUserActivity(userId: string) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId } });
    if (user) {
      user.lastActivity = new Date();
      user.hasExpired = false;
      await this.dataSource.getRepository(User).save(user);

      const reminders = await this.dataSource
        .getRepository(Reminder)
        .find({ where: { user_id: user.id } });
      if (reminders) {
        for (const reminder of reminders) {
          reminder.hasResponed = true;
          await this.dataSource.getRepository(Reminder).save(reminder);
        }
      }
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
