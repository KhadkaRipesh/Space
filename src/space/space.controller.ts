import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSpaceDto, ShareSpaceDto } from './dto/space.dto';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/@guards/jwt.guard';
import { RoleGuard } from 'src/auth/strategies/role.guard';
import { Roles } from 'src/@docoraters/getRoles.decorater';
import { UserType } from 'src/user/entities/user.entity';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  //   -----------------Create Space---------------
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserType.USER)
  @Post('create-space')
  createSpace(@Body() payload: CreateSpaceDto) {
    return this.spaceService.createSpace(payload);
  }
  //   -----------------Share Space----------------
  @Post('share-space/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserType.USER)
  shareSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ShareSpaceDto,
  ) {
    return this.spaceService.shareSpace(payload, id);
  }
}
