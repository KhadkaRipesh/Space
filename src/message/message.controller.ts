import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

    //-------------CREATE MESSAGE ROUTE ----------------- 
    @Post('/create-message')
    @UseGuards(JwtAuthGuard)
    createMessage(@GetUser() user: User, @Body() payload: CreateMessageDto){
        return this.messageService.createMessage(user, payload);
    }
    
    
}
