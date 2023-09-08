import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Space } from './space.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'shares' })
export class Share {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  hasAccess: boolean;

  // ************Relations***********
  @Column()
  space_id: string;
  @ManyToOne(() => Space, (space) => space.shares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: Space;

  @Column()
  user_id: string;
  @ManyToOne(() => User, (user) => user.shares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
