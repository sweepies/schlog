import Logger from "./index"

const log = new Logger() 
const testOutput = "Test output"
const level = log.getLogLevelByName("warn")

log.setLogLevel(level) // don't use default

test('test log formatting', () => {
    expect(log.format(level, testOutput, true)).toBe(`\u001b[33m\u001b[1mWARN\u001b[22m\u001b[39m ${testOutput}`)
})

test('test json formatting', () => {
    expect(log.formatJson(level, testOutput)).toMatch(new RegExp(`^{"time":".*","level":${JSON.stringify(level)},"message":"${testOutput}"}$`))
})

test('test log printing', async () => {
    expect(typeof await log.warn(testOutput)).toBe('string')
})

test('test json printing', async () => {
    expect(typeof await log.warn(testOutput, true)).toBe('string')
})

test('test higher log level', async () => {
    expect(await log.info(testOutput)).toBeUndefined()
})

