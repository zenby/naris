import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'bar' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ example: 'bar@foo.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  readonly password: string;
}
