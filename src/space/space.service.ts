import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateSpaceDto, ShareSpaceDto } from './dto/space.dto';
import { Space } from './entities/space.entity';
import { Share } from './entities/share.entity';
import { sendmail } from 'src/@helpers/mail';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SpaceService {
  constructor(private readonly dataSource: DataSource) {}

  //   ----------Create Space--------------
  createSpace(user: User, payload: CreateSpaceDto) {
    console.log(user);
    return this.dataSource.getRepository(Space).save(payload);
  }

  //   ----------Share Space---------------
  async shareSpace(payload: ShareSpaceDto, space_id: string) {
    const { email } = payload;
    // Checking if the space is available or not
    const space = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id: space_id } });

    //  If space doesnot exists.
    if (!space) throw new NotFoundException('The space doesnot exists.');

    // creating new object for sharing.
    const share = new Share();
    share.email = email;
    share.space_id = space_id;

    sendmail({
      to: email,
      subject: 'Space Shared for you',
      html: `<h1> The space is shared and you have all access of it.</h1>`,
    });
    // Saving share
    await this.dataSource.getRepository(Share).save(share);
  }

  //   -------CronJob for userActivation
}
