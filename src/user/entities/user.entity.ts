import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reminder } from './reminder.entity';
import { Space } from 'src/space/entities/space.entity';
import { Member } from 'src/space/entities/space_member.entity';

export enum AuthType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  OTHER = 'OTHER',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.EMAIL })
  auth_type: AuthType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: new Date() })
  lastActivity: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.user, { cascade: true })
  reminders: Reminder[];

  @OneToMany(() => Member, (member) => member.user, { cascade: true })
  members: Member[];

  @OneToMany(() => Space, (space) => space.user, { cascade: true })
  spaces: Space[];
}
