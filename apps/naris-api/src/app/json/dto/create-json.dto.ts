import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateJsonDto {
  @ApiProperty({
    example:
      '{"title":"Разобраться с документацией .http","overview":"Я впервые сталкиваюсь с подобным форматом и хотел бы его изучить. ","progress":0,"tasks":[]}',
  })
  @IsNotEmpty()
  readonly json: string;
}
