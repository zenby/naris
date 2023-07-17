import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { QuestionsService } from './questions.service';
import { QuestionEntity } from './question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity])],
  controllers: [QuestionsController],
  providers: [JwtStrategy, QuestionsService],
})
export class QuestionsModule {}
