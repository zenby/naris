import { ApiProperty } from '@nestjs/swagger';

export class BlockUserOptions {
  @ApiProperty({ example: 'true' })
  readonly isBlocked: boolean;
}
