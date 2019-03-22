import logger from "./index"

const testOutput = "Test output"

test('test log formatting', () => {
    let level = logger.getLogLevelByName("info")
    expect(logger.format(level, testOutput, true)).toBe(`\u001b[32m\u001b[1mINFO\u001b[22m\u001b[39m ${testOutput}`)
})

test('test log printing', async () => {
    process.env.LOG_LEVEL = "info"
    expect(typeof await logger.info(testOutput)).toBe('string')
})

test('test higher log level', async () => {
    process.env.LOG_LEVEL = "info"
    expect(await logger.debug(testOutput)).toBeUndefined()
})



