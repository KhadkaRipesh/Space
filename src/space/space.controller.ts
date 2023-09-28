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
  Query,
} from '@nestjs/common';
import {
  CreateSpaceDto,
  ShareSpaceDto,
  UpdateDaysToCheckDTO,
  UpdateSpaceDto,
} from './dto/space.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { User } from 'src/user/entities/user.entity';
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
import { SpaceFilterDto } from './dto/filter.dto';
import { PaginationDto } from './dto/pagination.dto';

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
  @ApiOkResponse({ description: 'Sucessfully update a space' })
  @ApiBadRequestResponse({ description: 'Failed to Update a space' })
  async updateSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    // Updating user last activity
    await this.userService.updateUserActivity(user.id);
    return this.spaceService.editSpaceById(id, user, updateSpaceDto);
  }

  // Get overview of each space
  @ApiOperation({ summary: 'Get overview of each space.' })
  @ApiOkResponse({ description: 'Overview Displayed Successfully.' })
  @ApiNotFoundResponse({ description: 'Space not found to get overview.' })
  @Get('overview/:id')
  async getOverview(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.spaceService.getOverview(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Auth')
  @ApiOperation({
    summary: 'Update the days to check the last activity of space creator.',
  })
  @ApiOkResponse({ description: 'Sucessfully update days' })
  @ApiBadRequestResponse({ description: 'Failed to Update days' })
  @Patch('change-days/:space_id')
  changeDaysToCheckLastActivity(
    @GetUser() user: User,
    @Param('space_id', new ParseUUIDPipe()) space_id: string,
    @Body() payload: UpdateDaysToCheckDTO,
  ) {
    return this.spaceService.changeDaysToCheckLastActivity(
      user,
      space_id,
      payload,
    );
  }

  // filter Spaces by Space Types

  @ApiOperation({ summary: 'filter a Space' })
  @ApiOkResponse({ description: 'Filter space sucessfully' })
  @ApiNotFoundResponse({ description: 'Space Not Found' })
  @UseGuards(JwtAuthGuard)
  @Get('/filter-spaces/')
  filterSpaces(
    @GetUser() user: User,
    @Query() query: SpaceFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.spaceService.filterSpace(user, query, pagination);
  }
}
