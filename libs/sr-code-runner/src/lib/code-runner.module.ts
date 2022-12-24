import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeRunnerService } from './code-runner.service';
import { JsExecutorService } from './executors/js-executor.service';
import { CodeExecutor } from './executors/code-executor.interface';

export const CODE_EXECUTOR_TOKEN: InjectionToken<CodeExecutor> = new InjectionToken('Code Executor');

@NgModule({
  imports: [CommonModule],
  providers: [
    CodeRunnerService,
    { provide: CODE_EXECUTOR_TOKEN, useClass: JsExecutorService, multi: true },
    // если нужно расширить другим языком
    // { provide: CODE_EXECUTOR_TOKEN, useClass: TsExecutorService, multi: true },
  ],
})
export class CodeRunnerModule {}
