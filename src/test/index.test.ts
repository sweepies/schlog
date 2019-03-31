import chalk from "chalk"

import { Logger as logger } from "../index"
import LogLevel from "../lib/LogLevel"
import { LogScope } from "../lib/LogScope"

const testOutput = "Test output"
const level = logger.getLogLevelByName("warn")

logger.setLogLevel(level) // don't use default

test("test formatting", () => {
    logger.setPrintTimestamps(false)
    const result = logger.format(level, testOutput)
    expect(result).toBe(`${logger.getLogLevel().getColor()(level.getName().toUpperCase())} ${testOutput}`)
})

test("test json formatting", () => {
    logger.setPrintTimestamps(true)
    const result = logger.formatJson(level, testOutput)
    expect(result).toMatch(new RegExp(`^{"time":".*","level":${JSON.stringify(level)},"message":"${testOutput}"}$`))
})

test("test customization", () => {
    logger.setPrintTimestamps(false)
    const result = logger.log(new LogLevel("fancy", chalk.magenta.underline, -1, LogScope.STDOUT), testOutput)
    expect(result).toBe(`${chalk.magenta.underline("FANCY")} ${testOutput}`)
})

test("test higher log level", async () => {
    expect(await logger.info(testOutput)).toBeUndefined()
})
