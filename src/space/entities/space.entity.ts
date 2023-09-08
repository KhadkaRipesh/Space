import { Message } from 'src/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Share } from './share.entity';

@Entity({ name: 'spaces' })
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  space_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.space, { cascade: true })
  messages: Message[];

  @OneToMany(() => Share, (share) => share.space, { cascade: true })
  shares: Share[];
}
