import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
<<<<<<< Updated upstream
  providers: [AuthService, JwtService, GoogleStrategy],
=======
  providers: [AuthService, JwtService, GoogleStrategy, JwtStrategy],
>>>>>>> Stashed changes
})
export class AuthModule {}
