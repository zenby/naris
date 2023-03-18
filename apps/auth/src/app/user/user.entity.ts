import { BeforeInsert, Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { genSalt, hash } from 'bcrypt';
import { IsEmail, IsNotEmpty } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  login: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  async isAdmin() {
    return this.role === UserRole.ADMIN;
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password === '') return;
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
}
