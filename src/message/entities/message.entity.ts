import { Space } from 'src/space/entities/space.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  space_id: string;
  @ManyToOne(() => Space, (space) => space.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: Space;
}
