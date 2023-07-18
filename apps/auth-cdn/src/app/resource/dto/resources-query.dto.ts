import { IsOptional } from 'class-validator';

export class ResourcesQueryDto {
  @IsOptional()
  filename: string;

  @IsOptional()
  folder: string;
}
