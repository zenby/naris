import { Subscription } from 'rxjs';
import { CodeLanguage } from './code-runner.model';
import { CodeRunnerService } from './code-runner.service';
import { CodeExecutor } from './executors/code-executor.interface';

describe('CodeRunnerService', () => {
  let service: CodeRunnerService;

  const MockCodeExecutor = {
    language: 'javascript',
    runCode: jest.fn(),
    terminate: jest.fn(),
  } as unknown as CodeExecutor;

  const mockCode = 'const a = 123';
  const subscriptions: Subscription[] = [];

  beforeEach(() => {
    service = new CodeRunnerService([MockCodeExecutor]);
  });

  afterAll(() => {
    subscriptions.forEach((sub) => sub.unsubscribe());
  });

  it('CodeRunnerService is defined', () => {
    expect(service).toBeDefined();
  });

  it('`runCode` method is called', () => {
    service.runCode('javascript', mockCode);
    expect(MockCodeExecutor.runCode).toBeCalled();
  });

  it('`runCode` method returns correct CodeExecutionResult for wrong language', (done) => {
    const wrongLanguage = 'wrong language' as CodeLanguage;
    subscriptions.push(
      service.runCode(wrongLanguage, mockCode).subscribe((result) => {
        expect(result.level).toEqual('error');
        expect(result.data).toBeDefined();
        done();
      })
    );
  });

  it('`terminate` method terminates worker', () => {
    service.runCode('javascript', mockCode);
    service.terminate();
    expect(MockCodeExecutor.terminate).toBeCalled();
  });
});
