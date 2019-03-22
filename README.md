# Schlog
Simple Node.js logger

![GitHub](https://img.shields.io/github/license/sweepyoface/schlog.svg)
![npm](https://img.shields.io/npm/v/schlog.svg)
![Travis (.com)](https://img.shields.io/travis/com/sweepyoface/schlog.svg)

## Installation
Install using [yarn](https://yarnpkg.com/en/package/jest):

```bash
yarn add schlog
```

Or [npm](https://www.npmjs.com/):

```bash
npm install schlog
```
## Basic usage
```javascript
const logger = require("schlog")

logger.setLogLevel(logger.getLogLevelByName("warn"))
// or set LOG_LEVEL environment variable to any of the default levels
// (by name or number)
// defaults to info (2)

logger.warn("Test")
// [21:52:58] WARN Test

logger.info("Test")
// nothing (since level is set to warn)
```
Default log levels: `error`, `warn`, `info`, `debug` or `0-4`

`error` and `warn` will output to stderr while `info` and `debug` will output to stdout.

Log functions return the same thing they output to the console. Either the log line or nothing if the log level is set higher than the level called.

## Example customization
```javascript
const chalk = require("chalk")
const logger = require("schlog")
const LogLevel = require("schlog").LogLevel
const LogScope = require("schlog").LogScope

const logLevel = new LogLevel("fancy", chalk.magenta.underline, 4, LogScope.STDOUT)
logger.setLogLevel(logLevel)
// will only output with levels priorities 4 or lower

logger.setTimeFormat("MMMM Do YYYY, h:mm:ss a")
logger.log(logLevel, "Test")
// [March 21st 2019, 11:53:11 pm] FANCY Test

logger.setPrintTimestamps(false)
logger.log(logLevel, "Test")
// FANCY Test

logger.setPrintJson(true)
logger.log(logLevel, "Test")
// {"time":"21:52:58","level":{"name":"fancy","priority":4,"scope":"stdout"},"message":"Test"}
```