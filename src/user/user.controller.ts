import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseReminderDto } from './dto/reminder.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //    To response reminder
  @Post('respond-reminder/:id')
  responseToReminder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ResponseReminderDto,
  ) {
    return this.userService.responseToReminder(id, payload);
  }
}
