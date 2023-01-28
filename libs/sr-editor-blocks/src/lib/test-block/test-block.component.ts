import { Component, Input } from '@angular/core';

@Component({
  selector: 'soer-test-block',
  templateUrl: './test-block.component.html',
  styleUrls: ['./test-block.component.scss'],
})
export class TestBlockComponent {
  @Input() set text(value: string) {
    const blocks = value.split('\n\n');
    const answersText = blocks.pop();
    const question = blocks.join('\n\n');

    if (answersText) {
      const answers = (answersText + '').split('\n').map((tmpAnswer) => {
        const correct = tmpAnswer.substring(0, 1) === '+';
        return { answer: tmpAnswer.substring(1), correct };
      });
      this.answers = answers;
    }

    this.question = question;
  }

  question = '';
  answers: { answer: string; correct: boolean }[] = [];
}
