import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateSpaceDto,
  ShareSpaceDto,
  UpdateDaysToCheckDTO,
  UpdateSpaceDto,
} from './dto/space.dto';
import { Space, SpaceType } from './entities/space.entity';

import { Share } from './entities/share.entity';
import { sendmail } from 'src/@helpers/mail';
import { User } from 'src/user/entities/user.entity';
import { Member } from './entities/space_member.entity';
import { defaultMailTemplate } from 'src/@helpers/mail-templates/default.mail-template';
import { Message } from 'src/message/entities/message.entity';
import { share } from 'rxjs';
import { SpaceFilterDto } from './dto/filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginateResponse } from 'src/@helpers/pagination';

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

    space.space_type = SpaceType.SHARED;
    await this.dataSource.getRepository(Space).save(space);

    //  If space doesnot exists.
    if (!space) throw new NotFoundException('The space doesnot exists.');

    // creating new object for sharing.
    const share = new Share();
    share.email = email;
    share.space_id = space_id;
    share.user_id = user.id;

    sendmail({
      to: email,
      subject: 'Space Shared with You',
      html: defaultMailTemplate({
        title: 'Space Shared with You',
        name: share.email,
        message: `We are excited to inform you that a space has been shared with you. Please note that access to this space will become active after 15 days of my unactiviness`,
      }),
    });
    // Saving share
    await this.dataSource.getRepository(Share).save(share);

    return `Space shared to ${email}`;
  }

  //-----------------------  Accept the invitation for space  ------------------------

  async acceptSpaceInvitation(user: User, id: string) {
    // Get current user details.
    const currentuser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: user.id } });

    const share = await this.dataSource.getRepository(Share).findOne({
      where: {
        space_id: id,
        email: currentuser.email,
        hasAccess: true,
      },
    });
    if (!share) throw new BadRequestException('No space found.');

    // Register as a member
    const member = new Member();
    member.email = currentuser.email;
    member.space_id = id;
    member.user_id = currentuser.id;

    await this.dataSource.getRepository(Member).save(member);
    return { message: 'Succesfully accessed Space.', member };
  }

  //---------GET ACCESSIABLE SPACE --------------
  async getSpacesByCreator(user: User) {
    const members = await this.dataSource
      .getRepository(Member)
      .find({ where: { user_id: user.id } });

    if (!members) throw new BadRequestException('No spaces');
    const membersWithSpaces = [];
    for (const member of members) {
      const space = await this.dataSource
        .getRepository(Space)
        .findOne({ where: { id: member.space_id } });
      membersWithSpaces.push(space);
    }
    return membersWithSpaces;
  }

  //--------------DELETED CREATED SPACE -----------------
  async deleteSpaces(id: string, currentUser: User) {
    const member = await this.dataSource
      .getRepository(Member)
      .findOne({ where: { user_id: currentUser.id, space_id: id } });

    // Check if the space is available or not
    if (!member)
      throw new NotFoundException('Space not found of the current user.');

    await this.dataSource.getRepository(Space).delete(id);

    return `${member.space_id} deleted successfully.`;
  }

  // -------------EDIT SPACE ---------------------
  async editSpaceById(id: string, currentUser: User, payload: UpdateSpaceDto) {
    const { space_name } = payload;

    const member = await this.dataSource
      .getRepository(Member)
      .findOne({ where: { user_id: currentUser.id, space_id: id } });

    if (!member) throw new NotFoundException('Not found or permission denied.');

    // Update space details
    await this.dataSource
      .getRepository(Space)
      .update(id, { space_name: space_name });

    return `${member.space_id} updated successfully.`;
  }
  // Get overview of space
  async getOverview(id: string) {
    // Getting space
    const space = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id } });

    // If no space
    if (!space) throw new NotFoundException('Space Not Found');

    // Getting message
    const messages = await this.dataSource.getRepository(Message).find({
      where: { space_id: id },
      take: 5, //Number of messages to retrive on Overview
    });

    return { id, messages };
  }

  // Change days for checking space's creator's last activity
  async changeDaysToCheckLastActivity(
    currentUser: User,
    space_id: string,
    payload: UpdateDaysToCheckDTO,
  ) {
    const space = await this.dataSource
      .getRepository(Space)
      .findOne({ where: { id: space_id, user_id: currentUser.id } });

    if (space) throw new BadRequestException('Space not found.');

    space.share_access_on = payload.days;

    await this.dataSource.getRepository(Space).save(space);

    return `Updated Days to check the creator last activity to ${payload.days}`;
  }
  
  async filterSpace(
    currentUser: User,
    query: SpaceFilterDto,
    pagination: PaginationDto,
  ) {
    const member = await this.dataSource
      .getRepository(Member)
      .findOne({ where: { user_id: currentUser.id } });
    if (!member) throw new NotFoundException('Not found or permission denied.');

    const getType = query.type.toLowerCase();

    if (getType === 'private' || 'shared') {
      const numericPage = Number(pagination.page);
      const numericLimit = Number(pagination.limit);
      console.log(numericPage);
      console.log(numericLimit);

      if (isNaN(numericPage) || isNaN(numericLimit))
        throw new BadRequestException('Invalid pagination parameter');

      const filteredSpace = await this.dataSource
        .getRepository(Space)
        .createQueryBuilder('spaces')
        .where('spaces.space_type = :type', { type: query.type })
        .take(numericLimit)
        .skip((numericPage - 1) * numericLimit)
        .getManyAndCount();

      if (filteredSpace.length < 1)
        throw new BadRequestException('No Spaces Found.');
      return PaginateResponse(filteredSpace, numericPage, numericLimit);
    }
    throw new BadRequestException('Filter with valid Details..');

  }
}
