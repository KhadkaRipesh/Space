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

  @UseGuards(JwtAuthGuard)
  @Get('/all-spaces')
  getAllSpaces() {
    return this.spaceService.getAllSpacesByCreator();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getSpaces(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.spaceService.getSpacesByCreator(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getCreatedMessage(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.spaceService.findCreatedMessage(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  removeSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return this.spaceService.deleteSpaces(id,user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-space/:id')
  updateSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    return this.spaceService.editSpaceById(id,user,updateSpaceDto);
  }
  }
