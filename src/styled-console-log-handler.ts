import { LogHandler } from './logger.js';
import { applyStyle, supportsStyles, generateHue } from './console-styles.js';

export interface StyleOptions {
  /**
   * The namespaces are formatted to a fixed width prefix. The number of
   * characters does not include the delimiter. Default 20.
   */
  prefixLength?: number;

  /**
   * A string that is repeated to pad the namespaces into fixed width prefixes.
   * Default: `' '`.
   */
  prefixFiller?: string;

  /**
   * A string that separates the prefix and the log messages. Default: `' |'`.
   */
  prefixDelimiter?: string;

  /**
   * Overrides the detection of console style support.
   */
  useStyles?: boolean;
}

/**
 * Emits log messages to the console, prefixed by the namespaces. The
 * namespaces are formatted to fixed width prefixes, potentially with color.
 *
 * To use the `StyledConsoleLogHandler`, do:
 *
 * ```ts
 * import { logHandlers } from './logger';
 *
 * logHandlers.push(new StyledConsoleLogHandler());
 * ```
 */
export class StyledConsoleLogHandler implements LogHandler {
  #prefixLength: number;
  #prefixFiller: string;
  #prefixDelimiter: string;
  #useStyles: boolean;
  #prefixCache: Record<string, string[]> = {};

  constructor(options?: StyleOptions) {
    this.#prefixLength = options?.prefixLength ?? 20;
    this.#prefixFiller = options?.prefixFiller ?? ' ';
    this.#prefixDelimiter = options?.prefixDelimiter ?? ' |';
    this.#useStyles = options?.useStyles ?? supportsStyles();
  }

  log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void {
    if (!(namespace in this.#prefixCache)) {
      const prefix = [this.#createPrefix(namespace)];

      if (this.#useStyles) {
        const hueIndex = Object.keys(this.#prefixCache).length;
        applyStyle(prefix, { hue: generateHue(hueIndex), bold: true });
      }

      this.#prefixCache[namespace] = prefix;
    }

    if (['debug', 'log', 'info', 'warn', 'error'].includes(tag)) {
      console[tag as 'log'](...this.#prefixCache[namespace], message, ...messages);
    } else {
      console.log(...this.#prefixCache[namespace], `${tag}:`, message, ...messages);
    }
  }

  #createPrefix(namespace: string): string {
    return (
      `${namespace}${Array(this.#prefixLength).join(this.#prefixFiller)}`.slice(0, this.#prefixLength) +
      `${this.#prefixDelimiter}`
    );
  }
}
