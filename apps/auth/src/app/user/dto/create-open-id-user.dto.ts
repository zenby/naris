import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOpenIdUserDto {
  @ApiProperty({ example: 'bar' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ example: 'bar@foo.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
