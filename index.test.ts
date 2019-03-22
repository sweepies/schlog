import logger from "./index"

const testOutput = "Test output"
process.env.LOG_LEVEL = "info"
const level = logger.getLogLevelByName(process.env.LOG_LEVEL)

test('test log formatting', () => {
    expect(logger.format(level, testOutput, true)).toBe(`\u001b[32m\u001b[1mINFO\u001b[22m\u001b[39m ${testOutput}`)
})

test('test json formatting', () => {
    expect(logger.formatJson(level, testOutput)).toMatch(new RegExp(`^{"time":".*","level":${JSON.stringify(level)},"message":"${testOutput}"}$`))
})

test('test log printing', async () => {
    expect(typeof await logger.info(testOutput)).toBe('string')
})

test('test json printing', async () => {
    expect(typeof await logger.info(testOutput, true)).toBe('string')
})

test('test higher log level', async () => {
    expect(await logger.debug(testOutput)).toBeUndefined()
})



