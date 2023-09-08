import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/user/entities/user.entity';

export const ROLES = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES, Roles)