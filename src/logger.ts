export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';
export const logLevels: LogLevel[] = ['debug', 'log', 'info', 'warn', 'error'];
export const isLogLevel = (tag: string): tag is LogLevel => (logLevels as string[]).includes(tag);

export type LogMethod = (message: unknown, ...messages: unknown[]) => void;

export type Logger<Tags extends string> = {
  [Tag in Tags]: LogMethod;
};

export interface LogHandler {
  log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void;
}

export const defaultLogHandler: LogHandler = {
  log(namespace, tag, message, ...messages): void {
    if (isLogLevel(tag)) {
      console[tag](`${namespace}:`, message, ...messages);
    } else {
      console.log(`${namespace}/${tag}:`, message, ...messages);
    }
  },
};

// @ts-expect-error: Clear is created next.
export const logHandlers: LogHandler[] & { clear: () => void } = [defaultLogHandler];
logHandlers.clear = () => (logHandlers.length = 0);

function log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void {
  for (const handler of logHandlers) {
    handler.log(namespace, tag, message, ...messages);
  }
}

export function getLogger<Tags extends string = LogLevel>(namespace: string): Logger<Tags> {
  return new Proxy({} as Logger<Tags>, {
    get(_target: Logger<Tags>, tag: string, receiver: unknown): LogMethod {
      return log.bind(receiver, namespace, tag);
    },
  });
}
