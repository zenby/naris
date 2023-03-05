import {BeforeInsert, Column, Entity, Generated, PrimaryGeneratedColumn} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { genSalt, hash } from 'bcrypt';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
  @Generated("uuid")
  uuid: string;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
}
