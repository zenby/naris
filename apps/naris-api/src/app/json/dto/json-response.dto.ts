import { ApiProperty } from '@nestjs/swagger';
import { HttpJsonStatus } from '../../common/types/http-json-response.interface';
import { JsonEntity } from '../json.entity';

export class JsonResponseDto {
  @ApiProperty({ example: HttpJsonStatus.Ok })
  status: HttpJsonStatus;

  @ApiProperty({
    example: [
      {
        id: 1,
        createdAt: '2022-12-07T16:03:37.000Z',
        updatedAt: '2022-12-07T16:03:37.000Z',
        json: '{"title":"Разобраться с документацией .http","overview":"Я впервые сталкиваюсь с подобным форматом и хотел бы его изучить. ","progress":0,"tasks":[]}',
        group: 'md',
      },
    ],
  })
  items: JsonEntity[];
}
