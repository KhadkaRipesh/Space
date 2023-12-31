import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto, DeleteMessageDto } from './dto/message.dto';
import { UserService } from 'src/user/user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  //-------------CREATE MESSAGE ROUTE -----------------
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Create a Message' })
  @ApiCreatedResponse({
    description: 'Sucessfully created a message',
    type: CreateMessageDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to create a Message' })
  async createMessage(
    @GetUser() user: User,
    @Body() payload: CreateMessageDto,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.messageService.createMessage(user, payload);
  }

  //   Get Message of specific space
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Get message of Space' })
  @ApiOkResponse({ description: 'Sucessfully getting a message of a space' })
  @ApiBadRequestResponse({ description: 'Failed to get a message' })
  async getMessage(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.messageService.findMessagesById(user, id);
  }

  // Delete Message of specific space
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Delete message of Space' })
  @ApiOkResponse({ description: 'Message delted Successfully' })
  @ApiBadRequestResponse({ description: 'Failed to delte the message' })
  @ApiNotFoundResponse({ description: 'Message not found on specific space.' })
  async deleteMessage(
    @GetUser() user: User,
    @Body() payload: DeleteMessageDto,
  ) {
    await this.userService.updateUserActivity(user.id);
    return this.messageService.deleteMessage(user, payload);
  }
}
