import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AccessTag } from '../types/json.const';

export class PatchDocumentPropertiesDto {
  @ApiProperty({
    example: 'STREAM',
  })
  @IsOptional()
  readonly accessTag: AccessTag;
}
