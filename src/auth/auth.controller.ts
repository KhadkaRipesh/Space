import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/@docoraters/getUser.decorater';
import { GoogleAuthGuard } from 'src/@guards/google.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    // ------------REGISTER USER BY GOOGLE-------------

    @Get('/register-google')
    @UseGuards(GoogleAuthGuard)
    googleAsRegister(){}


    // --------REGISTER USER FROM GOOGLE CALLBACK-------------
    

    @Get('/google-callback')
    @UseGuards(GoogleAuthGuard)
    async registerUserFromGoogleCallback(@GetUser() user, @Res() res: Response){
        const value ={
            email: user._json.email,
            name: user._json.name,
        }
        const data = await this.authService.registerUserFromGoogle(value);
        return res.json(data);
    }
}
