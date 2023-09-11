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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

!ApiTags('User');
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/update-profile/:id')
  @ApiBearerAuth('Auth')
  @ApiCreatedResponse({
    description: 'Update user profile sucessfully',
    type: EditProfileDto,
  })
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiOkResponse({ description: 'Update User Profile Sucessfully' })
  @ApiBadRequestResponse({ description: 'Failed to update the profile' })
  updateProfile(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() editProfile: EditProfileDto,
  ) {
    return this.userService.editProfile(id, user, editProfile);
  }
}
