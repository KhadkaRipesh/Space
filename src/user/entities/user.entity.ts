import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reminder } from './reminder.entity';

export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: new Date() })
  lastActivity: Date;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  user_type: UserType;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.EMAIL })
  auth_type: AuthType;

  @OneToMany(() => Reminder, (reminder) => reminder.user, { cascade: true })
  reminders: Reminder[];
}
