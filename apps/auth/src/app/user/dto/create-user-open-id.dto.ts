import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserOpenIdDto {
  @ApiProperty({ example: 'bar@foo.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
