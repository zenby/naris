/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  const originalLog = console.log;

  console.log = function (...args: unknown[]) {
    args.forEach((arg) => postMessage({ level: 'log', data: stringifyValue(arg) }));
    originalLog.apply(console, args);
  };

  let result: unknown = eval(`(function(){${data}})()`);
  if (result instanceof Promise) {
    result = await result;
  }

  postMessage({ level: 'result', data: result });

  console.log = originalLog;
});

function stringifyValue(value: unknown): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'object') {
    const temp = JSON.stringify(value, undefined, undefined);
    return temp.length < 80 ? temp : JSON.stringify(value, undefined, 2);
  }

  return String(value);
}
