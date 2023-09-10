import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, UserService],
})
export class SpaceModule {}
