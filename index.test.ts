import logger, { LogLevel, LogScope } from "./index"
import chalk from "chalk"

const testOutput = "Test output"
const level = logger.getLogLevelByName("warn")

logger.setLogLevel(level) // don't use default

test('test log formatting', () => {
    logger.setPrintTimestamps(false)
    let result = logger.format(level, testOutput)
    expect(result).toBe(`\u001b[33m\u001b[1mWARN\u001b[22m\u001b[39m ${testOutput}`)
})

test('test json formatting', () => {
    logger.setPrintTimestamps(true)
    let result = logger.formatJson(level, testOutput)
    expect(result).toMatch(new RegExp(`^{"time":".*","level":${JSON.stringify(level)},"message":"${testOutput}"}$`))
})

test('test printing', async () => {
    expect(typeof await logger.warn(testOutput)).toBe('string')
})

test('test higher log level', async () => {
    expect(await logger.info(testOutput)).toBeUndefined()
})

test('test customization', () => {
    logger.setPrintTimestamps(false)
    let result = logger.log(new LogLevel("fancy", chalk.magenta.underline, -1, LogScope.STDOUT), testOutput)
    expect(result).toBe(`${chalk.magenta.underline("FANCY")} ${testOutput}`)
})