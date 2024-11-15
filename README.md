# @torgeilo/logger

Tiny, customizable logger, designed for the browser.

It's less than 400 bytes minified.

It has:

- Namespaces.
- Pluggable log handlers.
- Typed and customizable log levels (called tags internally).
- Basic minimal console log handler (default).
- Styled console log handler (separate bundle).
- No dependencies.

## Get started

```
import { getLogger } from '@torgeilo/logger';

const logger = getLogger('my namespace');

logger.log('Hello');
logger.debug('world');
```

Console output of the above (with console.log and console.debug):

```
my namespace: Hello
my namespace: world
```

## How to customize

### Disable logging

Empty the `logHandlers` array however you prefer. A `clear()` method is added for your convenience:

```
import { logHandlers } from '@torgeilo/logger';

logHandlers.clear();
```

### Styled console log handler

Import and add to the `logHandlers` array.

```
import { logHandlers } from '@torgeilo/logger';
import { StyledConsoleLogHandler } from '@torgeilo/logger/styled-console-log-handler';

logHandlers.clear(); // Remove the default log handler.
logHandlers.push(new StyledConsoleLogHandler());
```

### Custom log levels/tags

```
import { getLogger } from '@torgeilo/logger';

const logger = getLogger<'Finn' | 'Jake'>('Together Again');

logger.Finn('Oh, man, are they angry!');
logger.Jake('Angry and fresh outta ice cream!');
```

Default console output (console.log):

```
Together Again/Finn: Oh, man, are they angry!
Together Again/Jake: Angry and fresh outta ice cream!
```

### Custom log handler

Implement the `LogHandler` interface and add your implementation to the `logHandlers` array. The interface:

```
export interface LogHandler {
  log(namespace: string, tag: string, message: unknown, ...messages: unknown[]): void;
}
```

The tag is typically the log level.

### Possibilities

You could:

- Make a log handler which only outputs errors or warnings.
- Make a log handler which shows the log in an HTML element on screen.
- Make a log handler which sends errors to a remote error tracker.
- Make a log handler which sends a custom tag to a remote tracker: `logger.metric(123);`.
- Make a test reporter which logs the test run output, and a log handler which sends it somewhere useful, in addition to the console.
