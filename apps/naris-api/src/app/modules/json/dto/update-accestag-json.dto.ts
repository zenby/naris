import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AccessTag } from '../types/json.const';

export class UpdateAccessTagJsonDto {
  @ApiProperty({
    example: 'STREAM',
  })
  @IsNotEmpty()
  readonly accessTag: AccessTag;
}
