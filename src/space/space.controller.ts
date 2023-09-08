import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AcceptInvitationDto,
  CreateSpaceDto,
  ShareSpaceDto,
} from './dto/space.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  //   -----------------Create Space---------------
  @UseGuards(JwtAuthGuard)
  @Post('create-space')
  createSpace(@GetUser() user: User, @Body() payload: CreateSpaceDto) {
    return this.spaceService.createSpace(user, payload);
  }
  //   -----------------Share Space----------------
  @Post('share-space/:id')
  @UseGuards(JwtAuthGuard)
  shareSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ShareSpaceDto,
    @GetUser() user: User,
  ) {
    return this.spaceService.shareSpace(payload, id, user);
  }

  // ----------------Accept the invitation--------------
  @UseGuards(JwtAuthGuard)
  @Post('accept-invitation')
  acceptSpaceInvitation(
    @GetUser() user: User,
    @Body() payload: AcceptInvitationDto,
  ) {
    return this.spaceService.acceptSpaceInvitation(user, payload);
  }
}
