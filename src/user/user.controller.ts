<<<<<<< Updated upstream
import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseReminderDto } from './dto/reminder.dto';
=======
import {
  Controller,
  Patch,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/@docoraters/getRoles.decorater';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { RoleGuard } from 'src/auth/strategies/role.guard';
import { User, UserType } from './entities/user.entity';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { UserService } from './user.service';
import { EditProfileDto } from './dto/user.dto';
>>>>>>> Stashed changes

@Controller('user')
export class UserController {
<<<<<<< Updated upstream
  constructor(private readonly userService: UserService) {}

  //    To response reminder
  @Post('respond-reminder/:id')
  responseToReminder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ResponseReminderDto,
  ) {
    return this.userService.responseToReminder(id, payload);
=======
  constructor(private userService: UserService) {}
  @Patch('/update-profile/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserType.USER)
  updateProfile(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() editProfile: EditProfileDto,
  ) {
    return this.userService.editProfile(id, user, editProfile);
>>>>>>> Stashed changes
  }
}
