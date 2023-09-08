import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  userOtp: number;

  @Column()
  isVerify: boolean;

  @Column({type: 'enum', enum: UserType, default: UserType.USER })
  user_type: UserType;

  @Column({type: 'enum', enum: AuthType, default: AuthType.EMAIL})
  auth_type: AuthType; 

  @CreateDateColumn()
  createdAt: Date;
}
