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

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  //   -----------------Create Space---------------
  @UseGuards(JwtAuthGuard)
  @Post('create-space')
  createSpace(@Body() payload: CreateSpaceDto) {
    return this.spaceService.createSpace(payload);
  }
  //   -----------------Share Space----------------
  @Post('share-space/:id')
  @UseGuards(JwtAuthGuard)
  shareSpace(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: ShareSpaceDto,
  ) {
    return this.spaceService.shareSpace(payload, id);
  }
}
