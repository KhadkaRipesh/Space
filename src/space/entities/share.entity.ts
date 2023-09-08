import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Space } from './space.entity';

@Entity({ name: 'shares' })
export class Share {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  // ************Relations***********
  @Column()
  space_id: string;
  @ManyToOne(() => Space, (space) => space.shares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: Space;
}
