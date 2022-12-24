import { Injectable } from '@angular/core';
import { fromEvent, map, merge, Observable, throwError } from 'rxjs';
import { CodeExecutionResult, CodeLanguage } from '../code-runner.model';
import { CodeExecutor } from './code-executor.interface';

@Injectable()
export class JsExecutorService implements CodeExecutor {
  language: CodeLanguage = 'javascript';

  private worker: Worker | undefined;

  runCode(code: string): Observable<CodeExecutionResult> {
    if (typeof Worker !== 'undefined') {
      return this.executeJavascriptCode(code);
    } else {
      return throwError(() => new Error('Ваш браузер не поддерживает наш код'));
    }
  }

  terminate() {
    this.worker?.terminate();
  }

  private executeJavascriptCode(code: string): Observable<CodeExecutionResult> {
    this.worker = new Worker(new URL('./js-executor.worker', import.meta.url));
    const resultObservable$ = fromEvent<MessageEvent<CodeExecutionResult>>(this.worker, 'message').pipe(
      map(({ data }) => data)
    );
    const errorObservable$ = fromEvent<ErrorEvent>(this.worker, 'error').pipe(
      map(({ message }) => ({ level: 'error', data: message } as CodeExecutionResult))
    );
    this.worker.postMessage(code);
    return merge(resultObservable$, errorObservable$);
  }
}
