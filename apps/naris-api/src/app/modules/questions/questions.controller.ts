import { Body, Controller, Delete, Get, Param, Post, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayloadFromRequest } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { QuestionEntity } from './question.entity';

const questionIdParam = 'questionId';

@ApiTags('QuestionsAnswers')
@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestions(): Promise<HttpJsonResult<QuestionEntity> | Error> {
    try {
      const questions = await this.questionsService.getQuestions();

      return { status: HttpJsonStatus.Ok, items: questions };
    } catch {
      throw new InternalServerErrorException('Something went wrong. Please, reload the page.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyQuestions() {
    throw new Error('Not implemented');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(@JwtPayloadFromRequest() jwtPayload: JwtPayload, @Body() { question }: { question: string }) {
    await this.questionsService.create({ question }, jwtPayload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(`:${questionIdParam}`)
  async removeQuestion(@Param(questionIdParam) questionId: number, @JwtPayloadFromRequest() jwtPayload: JwtPayload) {
    await this.questionsService.remove({ questionId }, jwtPayload);
  }
}
