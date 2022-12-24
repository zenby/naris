export type CodeLanguage = 'javascript' | 'typescript';

type CodeExecutionLevel = 'result' | 'log' | 'error';

export type CodeExecutionResult = {
  level: CodeExecutionLevel;
  data: unknown;
};
