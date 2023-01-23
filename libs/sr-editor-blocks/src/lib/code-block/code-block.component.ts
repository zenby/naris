import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CodeRunnerService, CodeExecutionResult } from '@soer/sr-code-runner';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { BasicBlockComponent } from '../basic-block.component';

@Component({
  selector: 'soer-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
  providers: [CodeRunnerService],
})
export class CodeBlockComponent implements OnInit, OnDestroy, BasicBlockComponent {
  @Input() text = '';

  codeResult$ = new BehaviorSubject<CodeExecutionResult[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private codeRunnerService: CodeRunnerService) {}

  ngOnInit(): void {
    this.codeRunnerService
      .runCode('javascript', this.text)
      .pipe(takeUntil(this.destroy$))
      .subscribe((executionMessage: CodeExecutionResult) => {
        this.codeResult$.next([...this.codeResult$.value, executionMessage]);
      });
  }

  ngOnDestroy(): void {
    this.codeRunnerService.terminate();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
