export type LogMethod = (message: unknown, ...messages: unknown[]) => void;

export type Logger<Tags extends string | number | symbol> = {
  [Tag in Tags]: LogMethod;
};

export type DefaultTags = 'debug' | 'log' | 'info' | 'warn' | 'error';
const defaultTags = ['debug', 'log', 'info', 'warn', 'error'];

export interface LogHandler {
  log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void;
}

export const defaultLogHandler: LogHandler = {
  log(namespace, tag, message, ...messages): void {
    if (defaultTags.includes(tag)) {
      console[tag as DefaultTags](`${namespace}:`, message, ...messages);
    } else {
      console.log(`${namespace}/${tag}:`, message, ...messages);
    }
  },
};

// @ts-expect-error: Clear isn't in the first assignment.
export const logHandlers: LogHandler[] & { clear: () => void } = [defaultLogHandler];
logHandlers.clear = () => (logHandlers.length = 0);

function log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void {
  for (const handler of logHandlers) {
    handler.log(namespace, tag, message, ...messages);
  }
}

export function getLogger<Tags extends string | number | symbol = DefaultTags>(namespace: string): Logger<Tags> {
  return new Proxy({} as Logger<Tags>, {
    get(_target: Logger<Tags>, tag: string, receiver): LogMethod {
      return log.bind(receiver, namespace, tag);
    },
  });
}
