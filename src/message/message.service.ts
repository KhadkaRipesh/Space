import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMessageDto, DeleteMessageDto } from './dto/message.dto';
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

    if (!user)
      throw new UnauthorizedException('Space not found or Permsion denied.');

    const message = new Message();

    message.content = content;
    message.space_id = space_id;
    console.log(message.content);

    return await this.dataSource.getRepository(Message).save(message);
  }

  //-------------Find messages of space ---------------
  async findMessagesById(currentUser: User, id: string) {
    const member = await this.dataSource
      .getRepository(Member)
      .findOne({ where: { user_id: currentUser.id, space_id: id } });

    if (!member) throw new NotFoundException('Not found or permission denied.');
    return await this.dataSource
      .getRepository(Message)
      .find({ where: { space_id: id } });
  }

  //  ------------Delte message of space----------
  async deleteMessage(currentUser: User, payload: DeleteMessageDto) {
    const member = await this.dataSource.getRepository(Member).findOne({
      where: { user_id: currentUser.id, space_id: payload.space_id },
    });

    if (!member) throw new NotFoundException('Not found or permission denied.');

    const message = await this.dataSource.getRepository(Message).findOne({
      where: { id: payload.message_id, space_id: payload.space_id },
    });
    if (!message) throw new NotFoundException('Message not found.');
    await this.dataSource.getRepository(Message).delete(message.id);

    return this.findMessagesById(currentUser, payload.space_id);
  }
}
