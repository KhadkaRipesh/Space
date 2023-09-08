import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}
  async updateUserActivity(user: User) {
    user.lastActivity = new Date();
    await this.dataSource.getRepository(User).save(user);
  }
}
