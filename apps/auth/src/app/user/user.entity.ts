import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
}
