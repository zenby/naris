import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  readonly question: string;

  @IsNotEmpty()
  readonly userUuid: string;
}
