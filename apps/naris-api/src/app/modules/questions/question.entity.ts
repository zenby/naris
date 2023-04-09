import { ApiProperty } from '@nestjs/swagger';
import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('questions')
export class QuestionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty()
  @Column()
  question: string;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @Column()
  userUuid: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
