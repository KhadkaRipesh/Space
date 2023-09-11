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
import { CreateSpaceDto, ShareSpaceDto, UpdateSpaceDto } from './dto/space.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Space')
@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly userService: UserService,
  ) {}

  //   -----------------Create Space---------------
  @UseGuards(JwtAuthGuard)
  @Post('create-space')
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Create a Space' })
  @ApiCreatedResponse({
    description: 'Space created sucessfully',
    type: CreateSpaceDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to create an space' })
  async createSpace(@GetUser() user: User, @Body() payload: CreateSpaceDto) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);

    return this.spaceService.createSpace(user, payload);
  }
  //   -----------------Share Space----------------
  @UseGuards(JwtAuthGuard)
  @Post('share-space/:id')
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Share the spaces' })
  @ApiCreatedResponse({
    description: 'Share space sucessfully',
    type: ShareSpaceDto,
  })
  @ApiOkResponse({ description: 'share space sucessfully' })
  @ApiBadRequestResponse({ description: 'Failed to share a space.' })
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
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Accept Space join invitation' })
  @ApiCreatedResponse({ description: 'accept the space joining invitation' })
  @ApiOkResponse({ description: 'Sucessfully accept the invitation' })
  @ApiBadRequestResponse({ description: 'Failed to get a space member' })
  acceptSpaceInvitation(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.spaceService.acceptSpaceInvitation(user, id);
  }

  // To get accessiable space
  @UseGuards(JwtAuthGuard)
  @Get('get-my-space')
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Get created space' })
  @ApiOkResponse({ description: 'sucessfully get the space' })
  @ApiBadRequestResponse({ description: 'Failed to obtain the space.' })
  async getSpaces(@GetUser() user: User) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.spaceService.getSpacesByCreator(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Delete the Space' })
  @ApiOkResponse({ description: 'Sucessfully delete the space' })
  @ApiBadRequestResponse({ description: 'Failed to delete the space' })
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
  @ApiBearerAuth('Auth')
  @ApiOperation({ summary: 'Update the Space' })
  @ApiCreatedResponse({
    description: 'Update Space sucessfully',
    type: UpdateSpaceDto,
  })
  @ApiOkResponse({ description: 'Sucessfully update a space' })
  @ApiBadRequestResponse({ description: 'Failed to Update a space' })
  @ApiOperation({ summary: 'Update the Space' })
  @ApiCreatedResponse({
    description: 'Update Space sucessfully',
    type: UpdateSpaceDto,
  })
  @ApiOkResponse({ description: '' })
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
