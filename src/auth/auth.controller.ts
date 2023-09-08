import { Controller, Get, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { GoogleAuthGuard } from 'src/@guards/google.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ------------REGISTER USER BY GOOGLE-------------
  @Get('/register/google')
  @ApiOperation({summary:'Register user through google'})
  @UseGuards(GoogleAuthGuard)
  googleAsRegister() {}

  // --------REGISTER USER FROM GOOGLE CALLBACK-------------
  @Get('/google/callback')
  @ApiOperation({summary: 'callback url for google authentication'})
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(GoogleAuthGuard)
  async registerUserFromGoogleCallback(@GetUser() user, @Res() res: Response) {
    const value = {
      email: user._json.email,
      name: user._json.name,
    };
    const data = await this.authService.registerUserFromGoogle(value);
    return res.json(data);
  }
}
