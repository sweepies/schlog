import chalk, { Chalk } from "chalk"
import moment from "moment"

class LogLevel {
    readonly name: string
    readonly color: Chalk
    readonly priority: number
    readonly scope: LogScope

    constructor(name: string, color: Chalk, priority: number, scope: LogScope) {
        this.name = name
        this.color = color
        this.priority = priority
        this.scope = scope
    }
}

enum LogScope {
    STDOUT,
    STDERR
}

class Logger {
    readonly logLevels: LogLevel[] = [
        new LogLevel("error", chalk.red.bold, 0, LogScope.STDERR),
        new LogLevel("warn", chalk.yellow.bold, 1, LogScope.STDERR),
        new LogLevel("info", chalk.green.bold, 2, LogScope.STDOUT),
        new LogLevel("debug", chalk.blue.bold, 3, LogScope.STDOUT),
    ]
    readonly logLevel: any

    constructor() {
        if (!process.env.LOG_LEVEL) {
            this.logLevel = this.getLogLevelByName("info")
        } else if (isNaN(parseInt(process.env.LOG_LEVEL))) { // is not a number
            this.logLevel = this.getLogLevelByName(process.env.LOG_LEVEL)
        } else {
            this.logLevel = this.getLogLevelByPriority(parseInt(process.env.LOG_LEVEL))
        }

        this.debug("Using log level: " + this.logLevel.name)
    }

    /**
     * Gets a log level from its name
     * @param name The name
     */
    getLogLevelByName(name: string) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.name === name)]
    }

    /**
     * Get a log level from its priority
     * @param priority The priority
     */
    getLogLevelByPriority(priority: number) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.priority === priority)]
    }

    /**
     * Format a message
     * @param level The log level to format for
     * @param message The message
     */
    format(level: LogLevel, message: any, notime?: boolean) {
        let time = moment().format("HH:mm:ss")
        let line = `${level.color(level.name.toUpperCase())} ${message}`

        if (!notime) line = `[${chalk.gray(time)}] ` + line
        return line
    }

    /**
     * Log a message
     * @param level The level to log in
     * @param message The message
     */
    log(level: LogLevel, message: string) {
        if (this.logLevel.priority >= level.priority) {
            let line = this.format(level, message)
            level.scope === LogScope.STDERR ? console.error(line) : console.log(line)
            return line
        }
    }

    /**
    * Format a message with the error log level
    * @param message The message
    * @returns The log line or nothing if the log level wasn't high enough
    */
    async error(message: any): (Promise<string | void>) {
        return this.log(this.logLevels[0], message)
    }


    /**
     * Format a message with the warn log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async warn(message: any): (Promise<string | void>) {
        return this.log(this.logLevels[1], message)
    }

    /**
     * Format a message with the info log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async info(message: any): (Promise<string | void>) {
        return this.log(this.logLevels[2], message)
    }

    /**
     * Format a message with the debug log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async debug(message: any): (Promise<string | void>) {
        return this.log(this.logLevels[3], message)
    }
}

export default new Logger()




