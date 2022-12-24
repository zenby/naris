import { Observable } from 'rxjs';
import { CodeExecutionResult, CodeLanguage } from '../code-runner.model';

export interface CodeExecutor {
  language: CodeLanguage;
  runCode(code: string): Observable<CodeExecutionResult>;
  terminate(): void;
}
