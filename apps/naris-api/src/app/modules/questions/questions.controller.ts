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
import messages from './constants/messages';

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

      throw new InternalServerErrorException(messages.questionsGettingError);
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
        throw new UnauthorizedException(messages.unauthorisizedQuestionCreation);
      }

      if (result === QuestionSavingResult.EmptyQuestionError) {
        return { status: HttpJsonStatus.Error, items: [messages.emptyQuestion] };
      }

      return { status: HttpJsonStatus.Ok, items: [messages.questionCreated] };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      this.logger.error(e);

      throw new InternalServerErrorException(messages.questionCreationError);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':qid')
  async removeQuestion(@Param('qid') questionId: number): Promise<HttpJsonResult<string> | Error> {
    try {
      const result = await this.questionsService.remove({ questionId });

      if (result === QuestionDeleteResult.NotFoundError) {
        return { status: HttpJsonStatus.Error, items: [messages.questionNotFound] };
      }

      return { status: HttpJsonStatus.Ok, items: [messages.questionDeleted] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(messages.questionDeleteError);
    }
  }
}
