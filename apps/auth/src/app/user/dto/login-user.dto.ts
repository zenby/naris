import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'bar' })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  readonly password: string;
}
