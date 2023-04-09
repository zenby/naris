import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayloadFromRequest } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.interface';

const questionIdParam = 'questionId';

@ApiTags('QuestionsAnswers')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getAll() {
    await this.questionsService.getAll();
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
