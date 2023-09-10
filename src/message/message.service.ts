import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMessageDto } from './dto/message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { Member } from 'src/space/entities/space_member.entity';

@Injectable()
export class MessageService {
  constructor(private readonly dataSource: DataSource) {}

  // --------------CREATE MESSAGE WITHIN SPACE --------------------
  async createMessage(currentUser: User, payload: CreateMessageDto) {
    const { content, space_id } = payload;
    // For checking if the user is has access of the space or not.
    const user = await this.dataSource
      .getRepository(Member)
      .findOne({ where: { user_id: currentUser.id, space_id: space_id } });

    if (!user) throw new UnauthorizedException('Permsion denied.');

    const message = new Message();

    message.content = content;
    message.space_id = space_id;
    console.log(message.content);

    return await this.dataSource.getRepository(Message).save(message);
  }
}
