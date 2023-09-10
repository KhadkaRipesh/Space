import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMessageDto } from './dto/message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(private readonly dataSource: DataSource) {}
  async createMessage(currentUser: User, payload: CreateMessageDto) {
    try {
      const { content, space_id} = payload;
      const user = await this.dataSource
        .getRepository(User)
        .findOne({ where: { id: currentUser.id } });

      if (!user) throw new BadRequestException('User Not Found');
      const message = new Message();

      message.content = content;
      message.space_id = space_id;
      console.log(message.content);

      return await this.dataSource.getRepository(Message).save(message);
    } catch (error) {
      // Handle the error appropriately, e.g., logging and returning an error response
      console.error(error);
      throw new BadRequestException('Failed to create message');
    }
  }
 
  
}
