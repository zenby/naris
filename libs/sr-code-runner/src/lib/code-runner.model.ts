export type CodeLanguage = 'javascript' | 'typescript';

type CodeExecutionLevel = 'result' | 'level' | 'error';

export type CodeExecutionResult = {
  level: CodeExecutionLevel;
  data: unknown;
};
