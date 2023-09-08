import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './@config/typeorm.config';
import { SpaceModule } from './space/space.module';
import { MessageModule } from './message/message.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({ useFactory: () => TypeOrmConfig }),
    ScheduleModule.forRoot(),
    SpaceModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
