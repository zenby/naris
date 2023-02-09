import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GetPdfDto {
  @ApiProperty({
    example: '### Hello',
  })
  @IsNotEmpty()
  readonly content: string
}
