import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { User } from './entities/user.entity';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { EditProfileDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update-profile/:id')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() editProfile: EditProfileDto,
  ) {
    return this.userService.editProfile(id, user, editProfile);
  }
}
