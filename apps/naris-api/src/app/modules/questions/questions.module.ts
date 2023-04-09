import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { QuestionsService } from './questions.service';

@Module({
  controllers: [QuestionsController],
  providers: [JwtStrategy, QuestionsService],
})
export class QuestionsModule {}
