import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccessTag } from './types/json.const';

@Entity('documents')
export class JsonEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @ApiProperty()
  @Column('text')
  json: string;

  @ApiProperty()
  @Column()
  namespace: string;

  @ApiProperty()
  @Column()
  author_email: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: AccessTag, default: AccessTag.PRIVATE })
  accessTag: string;
}
