# @torgeilo/logger

Tiny, customizable logger, designed for the browser.

It's less than 400 bytes minified.

## Features

- Namespaces.
- Pluggable log handlers.
- Typed and customizable log levels (called tags internally).
- Basic minimal console log handler (default).
- Styled console log handler (separate bundle).
- No dependencies.

## Getting started

Install:

```sh
npm install @torgeilo/logger
```

Use:

```ts
import { getLogger } from '@torgeilo/logger';

const logger = getLogger('my namespace');

logger.log('Hello');
logger.debug('world');
```

Default console output of the above (with levels log and debug):

```
my namespace: Hello
my namespace: world
```

Default levels: debug, log, info, warn, error.

## Customizing

### Disable logging

Empty the `logHandlers` array however you prefer. A `clear()` method is added for convenience:

```ts
import { logHandlers } from '@torgeilo/logger';

logHandlers.clear();
```

### Styled console log handler

Import and add the styled console log handler to the `logHandlers` array.

```ts
import { logHandlers } from '@torgeilo/logger';
import { StyledConsoleLogHandler } from '@torgeilo/logger/styled-console-log-handler.js';

logHandlers.clear(); // Remove the default log handler.
logHandlers.push(new StyledConsoleLogHandler());
```

### Custom log levels/tags

```ts
import { getLogger } from '@torgeilo/logger';

const logger = getLogger<'Finn' | 'Jake'>('Together Again');

logger.Finn('Oh, man, are they angry!');
logger.Jake('Angry and fresh outta ice cream!');
```

Default console output (with level log):

```ts
Together Again/Finn: Oh, man, are they angry!
Together Again/Jake: Angry and fresh outta ice cream!
```

### Custom log handler

Implement the `LogHandler` interface and add your implementation to the `logHandlers` array. The interface:

```ts
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
- Make a log handler which sends a custom tag to a remote tracker, like `logger.metric(123);`.
- Make a test reporter which logs the test run output, and a log handler which sends it somewhere useful, in addition to the console.

## Contributing

Smaller bug reports are welcome.

I don't have capacity for much else. You're probably better off forking if you want to change things.
