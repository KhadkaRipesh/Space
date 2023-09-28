import { Message } from 'src/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Share } from './share.entity';
import { User } from 'src/user/entities/user.entity';
import { Member } from './space_member.entity';

export enum SpaceType {
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED',
}

@Entity({ name: 'spaces' })
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  space_name: string;

  @Column({ default: 15 })
  share_access_on: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: SpaceType, default: SpaceType.PRIVATE })
  space_type: SpaceType;

  @OneToMany(() => Message, (message) => message.space, { cascade: true })
  messages: Message[];

  @OneToMany(() => Share, (share) => share.space, { cascade: true })
  shares: Share[];

  @OneToMany(() => Member, (member) => member.space, { cascade: true })
  members: Share[];

  @Column()
  user_id: string;
  @ManyToOne(() => User, (user) => user.spaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
