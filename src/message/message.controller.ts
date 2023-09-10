import { Body, Controller, Post, UseGuards , Get, Param, ParseUUIDPipe} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService){}

    @Post('/create-message')
    @UseGuards(JwtAuthGuard)
    createMessage(@GetUser() user: User, @Body() payload: CreateMessageDto){
        return this.messageService.createMessage(user, payload);
    }
    @Get('/get-all-message')
    @UseGuards(JwtAuthGuard)
    getAllMessages(@GetUser() user: User){
        return this.messageService.findAllMessage(user);
    }
    @Get('/get-message/:id')
    @UseGuards(JwtAuthGuard)
    getMessage(@GetUser() user: User, @Param('id', new ParseUUIDPipe())id: string) {
        return this.messageService.findMessagesById(user, id);
    }
}
