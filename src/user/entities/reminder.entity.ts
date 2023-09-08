import { Space } from 'src/space/entities/space.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'reminders' })
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  user_id: string;
  @ManyToOne(() => User, (user) => user.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  hasResponed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
