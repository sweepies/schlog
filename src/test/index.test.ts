const testOutput = "Test output"

test("test unset env var", () => {
    jest.resetModules()
    const logger = require("../index").Logger

    expect(logger.getLogLevel()).toBe(logger.getDefaultLogLevel())
})

test("test setting env var to string", () => {
    jest.resetModules()
    process.env.LOG_LEVEL = "warn"
    const logger = require("../index").Logger

    expect(logger.getLogLevel()).toBe(logger.getLogLevelByName(process.env.LOG_LEVEL))
})

test("test setting env var to invalid string", () => {
    jest.resetModules()
    process.env.LOG_LEVEL = "_invalid"
    const logger = require("../index").Logger

    expect(logger.getLogLevel()).toBe(logger.getDefaultLogLevel())
})

test("test setting env var to int", () => {
    jest.resetModules()
    process.env.LOG_LEVEL = "1"
    const logger = require("../index").Logger

    expect(logger.getLogLevel()).toBe(logger.getLogLevels()[parseInt(process.env.LOG_LEVEL, 10)])
})

test("test setting env var to invalid int", () => {
    jest.resetModules()
    process.env.LOG_LEVEL = "50"
    const logger = require("../index").Logger

    expect(logger.getLogLevel()).toBe(logger.getDefaultLogLevel())
})

test("test formatting", () => {
    jest.resetModules()
    const logger = require("../index").Logger

    const level = logger.getLogLevel()

    const result = logger.format(level, testOutput)

    expect(result).toMatch(new RegExp(`^\\[.*\\] .* ${testOutput}`))
})

test("test formatting without timestamp", () => {
    jest.resetModules()
    const logger = require("../index").Logger

    const level = logger.getLogLevel()
    logger.setPrintTimestamps(false)

    const result = logger.format(level, testOutput)

    expect(result).toBe(`${logger.getLogLevel().getColor()(level.getName().toUpperCase())} ${testOutput}`)
})

test("test json logging", () => {
    jest.resetModules()
    const logger = require("../index").Logger

    const level = logger.getLogLevel()
    logger.setPrintJson(true)

    const result = logger.log(level, testOutput)

    expect(result).toMatch(new RegExp(`^{"time":".*","level":${JSON.stringify(level)},"message":"${testOutput}"}$`))
})

test("test customization", () => {
    jest.resetModules()
    const chalk = require("chalk")
    const stripAnsi = require("strip-ansi")
    const schlog = require("../index")
    const logger = schlog.Logger
    const LogLevel = schlog.LogLevel
    const LogScope = schlog.LogScope

    const level = new LogLevel("fancy", chalk.magenta.underline, -1, LogScope.STDOUT)
    logger.setTimeFormat("HH")

    const result = logger.log(level, testOutput)
    const resultParts = result.split(" ")

    expect(stripAnsi(resultParts[0])).toMatch(/^\[..\]/)
    expect(resultParts[1]).toBe(chalk.magenta.underline("FANCY"))
    expect(result).toMatch(new RegExp(`.* ${testOutput}$`))
})

test("test higher log level", async () => {
    const logger = require("../index").Logger
    expect(await logger.debug(testOutput)).toBeUndefined()
})
