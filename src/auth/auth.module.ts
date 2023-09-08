import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
<<<<<<< Updated upstream

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
=======
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleStrategy],
>>>>>>> Stashed changes
})
export class AuthModule {}
