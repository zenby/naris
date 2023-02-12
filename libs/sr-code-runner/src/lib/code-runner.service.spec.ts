import { of } from 'rxjs';
import { CodeExecutionResult, CodeLanguage } from './code-runner.model';
import { CodeRunnerService } from './code-runner.service';
import { CodeExecutor } from './executors/code-executor.interface';

describe('CodeRunnerService', () => {
  let service: CodeRunnerService;

  const mockCode = 'const a = 123';
  const mockExecutionResult: CodeExecutionResult = {
    level: 'result',
    data: 'mock data',
  };
  const mockCodeExecutor: CodeExecutor = {
    language: 'javascript',
    runCode: jest.fn(() => of(mockExecutionResult)),
    terminate: jest.fn(),
  };

  beforeEach(() => {
    service = new CodeRunnerService([mockCodeExecutor]);
  });

  it('runCode method calls code executor with correct arguments', () => {
    service.runCode('javascript', mockCode);
    expect(mockCodeExecutor.runCode).toBeCalledWith(mockCode);
  });

  it('runCode method returns correct results for known language', (done) => {
    service.runCode('javascript', mockCode).subscribe((result) => {
      expect(result).toEqual(mockExecutionResult);
      done();
    });
  });

  it('runCode method returns correct results for unknown language', (done) => {
    const wrongLanguage = 'wrong language' as CodeLanguage;
    service.runCode(wrongLanguage, mockCode).subscribe((result) => {
      expect(result.level).toEqual('error');
      expect(result.data).toBeDefined();
      done();
    });
  });

  it('terminate method terminates executor', () => {
    service.runCode('javascript', mockCode);
    service.terminate();
    expect(mockCodeExecutor.terminate).toBeCalled();
  });
});
