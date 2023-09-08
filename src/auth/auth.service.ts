import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthType, User, UserType } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';
import { GOOGLE, JwtSecret } from 'src/constant';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource, private jwtService: JwtService) {}
  async registerUserFromGoogle({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: email } });

    if (user && user.auth_type == AuthType.EMAIL)
      throw new BadRequestException('User with this email already exist.');

    if (!user) {
      const user = new User();
      (user.username = name),
        (user.email = email),
        (user.password = await argon.hash(GOOGLE.password)),
        (user.user_type = UserType.USER),
        (user.auth_type = AuthType.GOOGLE);
      await this.dataSource.getRepository(User).save(user);
    }
    console.log(GOOGLE.password);

    const newUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: email } });

    const jwtToken = await this.jwtService.signAsync(
      { sub: newUser.id },
      { expiresIn: '1d', secret: JwtSecret },
    );
    return {
      jwtToken,
      user_type: newUser.user_type,
    };
  }
}
