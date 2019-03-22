import chalk, { Chalk } from "chalk"
import moment from "moment"

class LogLevel {
    readonly name: string
    readonly color: Chalk
    readonly priority: number

    constructor(name: string, color: Chalk, priority: number) {
        this.name = name
        this.color = color
        this.priority = priority
    }
}

class Logger {
    readonly logLevels: LogLevel[] = [
        new LogLevel("error", chalk.red.bold, 0),
        new LogLevel("warn", chalk.yellow.bold, 1),
        new LogLevel("info", chalk.green.bold, 2),
        new LogLevel("debug", chalk.blue.bold, 3),
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
     * Format a message with the info log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async info(message: any): (Promise<string|void>) {
        let level = this.logLevels[2]
        if (this.logLevel.priority >= level.priority) {
            let line = this.format(level, message)
            console.info(line)
            return line
        }
    }

    /**
     * Format a message with the error log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async error(message: any): (Promise<string|void>) {
        let level = this.logLevels[0]
        if (this.logLevel.priority >= level.priority) {
            let line = this.format(level, message)
            console.info(line)
            return line
        }
    }

    /**
     * Format a message with the warn log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async warn(message: any): (Promise<string|void>) {
        let level = this.logLevels[1]
        if (this.logLevel.priority >= level.priority) {
            let line = this.format(level, message)
            console.info(line)
            return line
        }
    }

    /**
     * Format a message with the debug log level
     * @param message The message
     * @returns The log line or nothing if the log level wasn't high enough
     */
    async debug(message: any): (Promise<string|void>) {
        let level = this.logLevels[3]
        if (this.logLevel.priority >= level.priority) {
            let line = this.format(level, message)
            console.info(line)
            return line
        }
    }
}

export default new Logger()




