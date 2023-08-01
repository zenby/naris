import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ResourcesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by filename' })
  @IsOptional()
  filename: string;

  @ApiPropertyOptional({ description: 'Filter by folder name' })
  @IsOptional()
  folder: string;
}
