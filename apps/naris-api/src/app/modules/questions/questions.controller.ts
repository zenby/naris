import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayloadFromRequest } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { QuestionEntity } from './question.entity';
import { QuestionSavingResult } from '../../common/types/question-saving-result';
import { QuestionDeleteResult } from '../../common/types/question-delete-result';

@ApiTags('QuestionsAnswers')
@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestions(
    @JwtPayloadFromRequest() jwtPayload: JwtPayload,
    @Query('userId') userIdParam?: string
  ): Promise<HttpJsonResult<QuestionEntity> | Error> {
    try {
      const questions = await this.questionsService.getQuestions(userIdParam, jwtPayload);

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
  async createQuestion(
    @JwtPayloadFromRequest() jwtPayload: JwtPayload,
    @Body() { question, userId }: { question: string; userId: number }
  ): Promise<HttpJsonResult<string> | Error> {
    const questionData = { question, userId };
    const result = await this.questionsService.create(questionData, jwtPayload);

    if (result === QuestionSavingResult.UnauthorizedUserError) {
      throw new UnauthorizedException('userId must be the same as the current authorized user id');
    }

    if (result === QuestionSavingResult.EmpryQuestionError) {
      return { status: HttpJsonStatus.Error, items: ['The question cannot be empty'] };
    }

    return { status: HttpJsonStatus.Ok, items: ['The question has been created'] };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':qid')
  async removeQuestion(@Param('qid') questionId: number): Promise<HttpJsonResult<string> | Error> {
    const result = await this.questionsService.remove({ questionId });

    if (result === QuestionDeleteResult.NotFoundError) {
      return { status: HttpJsonStatus.Error, items: ['The question to delete was not found'] };
    }

    return { status: HttpJsonStatus.Ok, items: ['The question has been deleted'] };
  }
}
