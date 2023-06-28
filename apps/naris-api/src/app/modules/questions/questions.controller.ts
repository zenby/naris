import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  InternalServerErrorException,
  Query,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { QuestionAuthGuard } from './guards/question-auth.guard';
import { JwtPayloadFromRequest } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { QuestionEntity } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import messages from './constants/messages';

@ApiTags('QuestionsAnswers')
@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  private logger = new Logger(QuestionsController.name);

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestions(@Query('userUuid') userUuidParam?: string): Promise<HttpJsonResult<QuestionEntity> | Error> {
    try {
      const questions = await this.questionsService.getQuestions(userUuidParam);

      return { status: HttpJsonStatus.Ok, items: questions };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(messages.questionsGettingError);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createQuestion(
    @JwtPayloadFromRequest() jwtPayload: JwtPayload,
    @Body() createQuestionDto: CreateQuestionDto
  ): Promise<HttpJsonResult<QuestionEntity | string>> {
    try {
      const result = await this.questionsService.create(createQuestionDto, jwtPayload);

      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [result] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(messages.questionCreationError);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, QuestionAuthGuard)
  @Delete(':qid')
  async removeQuestion(@Param('qid') questionId: number): Promise<HttpJsonResult<string> | Error> {
    try {
      const result = await this.questionsService.remove({ questionId });

      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(messages.questionDeleteError);
    }
  }
}
