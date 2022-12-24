import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CodeExecutionResult, CodeLanguage } from './code-runner.model';
import { CODE_EXECUTOR_TOKEN } from './code-runner.module';
import { CodeExecutor } from './executors/code-executor.interface';

@Injectable()
export class CodeRunnerService {
  private codeExecutorsMap: Map<string, CodeExecutor> = new Map<string, CodeExecutor>();
  private executor: CodeExecutor | undefined;

  constructor(@Inject(CODE_EXECUTOR_TOKEN) executors: CodeExecutor[]) {
    executors.forEach((executor) => this.codeExecutorsMap.set(executor.language, executor));
  }

  runCode(lang: CodeLanguage, code: string): Observable<CodeExecutionResult> {
    this.executor = this.getExecutor(lang);

    if (!this.executor) {
      return of({ level: 'error', data: 'Unknown language' });
    }

    return this.executor.runCode(code);
  }

  terminate() {
    this.executor?.terminate();
  }

  private getExecutor(lang: string): CodeExecutor | undefined {
    return this.codeExecutorsMap.get(lang);
  }
}
