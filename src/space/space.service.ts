import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  AcceptInvitationDto,
  CreateSpaceDto,
  ShareSpaceDto,
  UpdateSpaceDto,
} from './dto/space.dto';
import { Space } from './entities/space.entity';
import { Share } from './entities/share.entity';
import { sendmail } from 'src/@helpers/mail';
import { User } from 'src/user/entities/user.entity';
import { Member } from './entities/space_member.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class SpaceService {
  constructor(private readonly dataSource: DataSource) {}

  //   ----------Create Space--------------
  async createSpace(user: User, payload: CreateSpaceDto) {
    const currentuser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: user.id } });

    const existSpaces: Space[] = await this.dataSource
      .getRepository(Space)
      .find();
    const spaceWithNameExists = existSpaces.some(
      (space) => space.space_name === payload.space_name,
    );
    if (spaceWithNameExists)
      throw new BadRequestException('Space with this name already exists.');

    const space = new Space();
    space.space_name = payload.space_name;
    space.user_id = user.id;
    await this.dataSource.getRepository(Space).save(space);

    // Add creater also as member
    const member = new Member();
    member.email = currentuser.email;
    member.space_id = space.id;
    member.user_id = user.id;

    await this.dataSource.getRepository(Member).save(member);

    return { space };
  }

  //   ----------Share Space---------------
  async shareSpace(payload: ShareSpaceDto, space_id: string, user: User) {
    const currentSpace = await this.dataSource
      .getRepository(Space)
      .find({ where: { user_id: user.id } });

    if (!currentSpace) throw new NotFoundException('The space is not found.');

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
    share.user_id = user.id;

    sendmail({
      to: email,
      subject: 'Space Shared for you',
      html: `<h1> The space is shared and you have all access of it.</h1>`,
    });
    // Saving share
    await this.dataSource.getRepository(Share).save(share);
  }

  //-----------------------  Accept the invitation for space  ------------------------

  async acceptSpaceInvitation(user: User, payload: AcceptInvitationDto) {
    const { space_id, invitation } = payload;

    // Get current user details.
    const currentuser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: user.id } });

    const share = await this.dataSource.getRepository(Share).findOne({
      where: {
        space_id: space_id,
        email: currentuser.email,
        hasAccess: true,
      },
    });
    if (!share) throw new BadRequestException('No space found.');
    if (invitation === 'accept') {
      const member = new Member();
      member.email = currentuser.email;
      member.space_id = space_id;
      member.user_id = currentuser.id;

      return 'Now you can access the data of the space.';
    }
  }
  async getAllSpacesByCreator() {
    const spaces = await this.dataSource.getRepository(Space).find();
    if (!spaces) throw new BadRequestException('Spaces Not Found..');
    return spaces;
  }
  async getSpacesByCreator(id: string) {
    const spaces = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id: id } });
    if (!spaces) throw new BadRequestException('Spaces not found');
    if (spaces) {
      console.log(spaces);
      return spaces;
    }
  }
  async findCreatedMessage(id: string) {
    const messages = await this.dataSource
      .getRepository(Message)
      .findOne({ where: { id: id } });
    if (!messages) throw new BadRequestException('Messages not found..');

    if (messages) {
      return messages;
    }
  }
  async deleteSpaces(id: string, currentUser: User) {
    const userExist = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: currentUser.id } });
    if (!userExist)
      throw new BadRequestException(
        'User of this spaces creator is not found.',
      );
    const findSpaces = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id: id } });
    if (!findSpaces) throw new BadRequestException('Spaces not found.');
    if (findSpaces) {
      return await this.dataSource.getRepository(Space).remove(findSpaces);
    }
  }
  async editSpaceById(id: string, currentUser: User, payload: UpdateSpaceDto) {
    const { space_name } = payload;
    const userExist = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: currentUser.id } });
    if (!userExist) throw new BadRequestException('User not found.');

    const existSpaces = await this.dataSource
      .getRepository(Space)
      .findOneBy({ id });
    if (!existSpaces) throw new BadRequestException('Space not found.');

    existSpaces.space_name = space_name;
    await this.dataSource.getRepository(Space).save(existSpaces);
  }
  async findMessagesById(currentUser: User, id: string) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: currentUser.id } });
    if (!user) throw new BadRequestException('User Not Found');
    const findMessage = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id: id } });
    if (!findMessage) throw new BadRequestException('Message not found.');
    if (user && findMessage) {
      return await this.dataSource.getRepository(Message).find();
    }
  }
  async findAllMessage(currentUser: User) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: currentUser.id } });
      console.log(user)
    if (!user) throw new BadRequestException('User not found');
    if (user) {
      return await this.dataSource.getRepository(Message).find();
    }
  }
}
