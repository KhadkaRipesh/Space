import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  AcceptInvitationDto,
  CreateSpaceDto,
  ShareSpaceDto,
  UpdateSpaceDto,
} from './dto/space.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly userService: UserService,
  ) {}

  //   -----------------Create Space---------------
  @UseGuards(JwtAuthGuard)
  @Post('create-space')
  async createSpace(@GetUser() user: User, @Body() payload: CreateSpaceDto) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);

    return this.spaceService.createSpace(user, payload);
  }
  //   -----------------Share Space----------------
  @Post('share-space/:id')
  @UseGuards(JwtAuthGuard)
  async shareSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ShareSpaceDto,
    @GetUser() user: User,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.spaceService.shareSpace(payload, id, user);
  }

  // ----------------Accept the invitation--------------
  @UseGuards(JwtAuthGuard)
  @Post('accept-invitation/:id')
  acceptSpaceInvitation(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.spaceService.acceptSpaceInvitation(user, id);
  }

  // To get accessiable space
  @UseGuards(JwtAuthGuard)
  @Get('get-my-space')
  async getSpaces(@GetUser() user: User) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.spaceService.getSpacesByCreator(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);

    return this.spaceService.deleteSpaces(id, user);
  }

  // update Space
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.spaceService.editSpaceById(id, user, updateSpaceDto);
  }
}
