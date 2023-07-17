import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionsController } from '../questions.controller';
import { JwtStrategy } from '../../../common/strategies/jwt.strategy';
import { QuestionsService } from '../questions.service';
import { QuestionEntity } from '../question.entity';
import { QuestionsTestRepository } from './questions.test.repository';

@Module({
  imports: [],
  providers: [
    JwtStrategy,
    QuestionsService,
    QuestionsTestRepository,
    { provide: getRepositoryToken(QuestionEntity), useClass: QuestionsTestRepository },
  ],
  controllers: [QuestionsController],
})
export class QuestionsTestModule {}
