import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { QuestionsService } from '../questions.service';

@Injectable()
export class QuestionAuthGuard implements CanActivate {
  constructor(@Inject(QuestionsService) private readonly questionsService: QuestionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { qid } = request.params;

    const question = await this.questionsService.getQuestionById(+qid);

    if (!question) {
      throw new NotFoundException();
    }

    if (question && question.userUuid !== user.uuid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
