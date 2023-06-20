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
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayloadFromRequest } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { QuestionEntity } from './question.entity';
import { QuestionSavingResult } from './types/question-saving-result';
import { QuestionDeleteResult } from './types/question-delete-result';
import { CreateQuestionDto } from './dto/create-question.dto';

@ApiTags('QuestionsAnswers')
@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  private logger = new Logger(QuestionsController.name);

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestions(
    @JwtPayloadFromRequest() jwtPayload: JwtPayload,
    @Query('userId') userIdParam?: string
  ): Promise<HttpJsonResult<QuestionEntity> | Error> {
    try {
      const questions = await this.questionsService.getQuestions(userIdParam, jwtPayload);

      return { status: HttpJsonStatus.Ok, items: questions };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException('Something went wrong. Please, reload the page.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(
    @JwtPayloadFromRequest() jwtPayload: JwtPayload,
    @Body() createQuestionDto: CreateQuestionDto
  ): Promise<HttpJsonResult<string> | Error> {
    try {
      const result = await this.questionsService.create(createQuestionDto, jwtPayload);

      if (result === QuestionSavingResult.UnauthorizedUserError) {
        throw new UnauthorizedException(
          'The question has not been saved. A userId must be the same as the current authorized user id'
        );
      }

      if (result === QuestionSavingResult.EmptyQuestionError) {
        return { status: HttpJsonStatus.Error, items: ['The question cannot be empty'] };
      }

      return { status: HttpJsonStatus.Ok, items: ['The question has been created'] };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      this.logger.error(e);

      const message = e.message || 'The question has not been saved. Please, try again later';
      throw new InternalServerErrorException(message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':qid')
  async removeQuestion(@Param('qid') questionId: number): Promise<HttpJsonResult<string> | Error> {
    try {
      const result = await this.questionsService.remove({ questionId });

      if (result === QuestionDeleteResult.NotFoundError) {
        return { status: HttpJsonStatus.Error, items: ['The question to delete was not found'] };
      }

      return { status: HttpJsonStatus.Ok, items: ['The question has been deleted'] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException('The question has not been deleted. Please, try again later');
    }
  }
}
