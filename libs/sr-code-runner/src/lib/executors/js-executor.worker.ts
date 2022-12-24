/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const originalLog = console.log;

  console.log = function (...args: unknown[]) {
    args.forEach((arg) => postMessage({ level: 'log', data: stringifyData(arg) }));
    originalLog.apply(console, args);
  };

  const result: string = eval(`(function(){${data}})()`);
  postMessage({ level: 'result', data: result });

  console.log = originalLog;
});

function stringifyData(value: unknown): string {
  return JSON.stringify(value, undefined, 2);
}
