import chalk, { Chalk } from "chalk"
import * as moment from "moment"

export class LogLevel {
    readonly name: string
    readonly color: Chalk
    readonly priority: number
    readonly scope: LogScope

    /**
     * Create a new log level
     * @param name The name
     * @param color The chalk color (or style)
     * @param priority The priority (the lower the number the higher priority of being output)
     * @param scope stdout or stderr
     */
    constructor(name: string, color: Chalk, priority: number, scope: LogScope) {
        this.name = name
        this.color = color
        this.priority = priority
        this.scope = scope
    }
}

export enum LogScope {
    STDOUT = "stdout",
    STDERR = "stderr"
}

export class Logger {
    static readonly logLevels: LogLevel[] = [
        new LogLevel("error", chalk.red.bold, 0, LogScope.STDERR),
        new LogLevel("warn", chalk.yellow.bold, 1, LogScope.STDERR),
        new LogLevel("info", chalk.green.bold, 2, LogScope.STDOUT),
        new LogLevel("debug", chalk.blue.bold, 3, LogScope.STDOUT),
    ]
    static readonly defaultLogLevel: LogLevel = Logger.logLevels[2]
    private static logLevel: any
    private static printTimestamps: boolean = true
    private static timeFormat: string = "HH:mm:ss"
    private static printJson: boolean

    /**
     * Sets the log level. Defaults to info.
     * @param level The level to set
     */
    static setLogLevel(level: LogLevel) {
        this.logLevel = level
    }

    /**
     * Gets the current log level.
     */
    static getLogLevel() {
        return this.logLevel
    }

    /**
     * Enable or disable printing timestamps.
     * @param bool True for enabled, false for disabled
     */
    static setPrintTimestamps(bool: boolean) {
        this.printTimestamps = bool
    }

    /**
     * Enable or disable JSON printing.
     * @param format True for enabled, false for disabled
     */
    static setPrintJson(bool: boolean) {
        this.printJson = bool
    }

    /**
     * Sets the Moment.js time format. Defaults to "HH:mm:ss".
     * @param format The time format
     */
    static setTimeFormat(format: string) {
        this.timeFormat = format
    }

    /**
     * Gets the current time format.
     */
    static getTimeFormat() {
        return this.timeFormat
    }

    /**
     * Finds a log level from its name.
     * @param name The name
     */
    static getLogLevelByName(name: string) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.name === name)]
    }

    /**
     * Finds a log level from its priority.
     * @param priority The priority
     */
    static getLogLevelByPriority(priority: number) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.priority === priority)]
    }

    /**
     * Format a message.
     * @param level The log level to format for
     * @param message The message
     */
    static format(level: LogLevel, message: any) {
        let line = `${level.color(level.name.toUpperCase())} ${message}`
        if (this.printTimestamps) {
            line = `[${chalk.gray(moment().format(this.timeFormat))}] ` + line
        } 
        return line
    }

    /**
     * Format a message in JSON.
     * @param level The log level to format for
     * @param message The message
     */
    static formatJson(level: LogLevel, message: any) {
        // we want time to be first in the string
        let object: any = {}
        if (this.printTimestamps) {
            object.time = moment().format(this.timeFormat)
        }
        object.level = level
        object.message = message
        let line = JSON.stringify(object)
        return line
    }

    /**
     * Log a message.
     * @param level The level to log in
     * @param message The message
     */
    static log(level: LogLevel, message: string) {
        //console.log(this.logLevel.priority, "against", level.priority)
        if (this.logLevel.priority >= level.priority) {
            let line = this.printJson ? this.formatJson(level, message) : this.format(level, message)
            level.scope === LogScope.STDERR ? console.error(line) : console.log(line)
            return line
        }
    }

    /**
    * Format a message with the error log level.
    * @param message The message
    * @param json Whether or not to format in json
    * @returns The log line or nothing if the log level wasn't high enough
    */
    static async error(message: any): Promise<string | void> {
        return this.log(this.logLevels[0], message)
    }

    /**
     * Format a message with the warn log level.
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line or nothing if the log level wasn't high enough
     */
    static async warn(message: any): Promise<string | void> {
        return this.log(this.logLevels[1], message)
    }

    /**
     * Format a message with the info log level.
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line or nothing if the log level wasn't high enough
     */
    static async info(message: any): Promise<string | void> {
        return this.log(this.logLevels[2], message)
    }

    /**
     * Format a message with the debug log level.
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line or nothing if the log level wasn't high enough
     */
    static async debug(message: any): Promise<string | void> {
        return this.log(this.logLevels[3], message)
    }

}

// set initial log level
if (!Logger.getLogLevel()) {
    if (!process.env.LOG_LEVEL) {
        // if not set
        Logger.setLogLevel(Logger.defaultLogLevel)
    } else if (isNaN(parseInt(process.env.LOG_LEVEL))) {
        // if set but not a number
        let levelFromName = Logger.getLogLevelByName(process.env.LOG_LEVEL)
        // handle invalid level string
        if (!levelFromName) {
            Logger.setLogLevel(Logger.defaultLogLevel)
        } else {
            Logger.setLogLevel(levelFromName) 
        }
    } else {
        // if set as number
        let levelFromNum = Logger.getLogLevelByPriority(parseInt(process.env.LOG_LEVEL))
        // handle invalid level number
        if (!levelFromNum) {
            Logger.setLogLevel(Logger.defaultLogLevel)
        } else {
            Logger.setLogLevel(levelFromNum)
        }
    }

    Logger.debug("Using log level: " + Logger.getLogLevel().name)
}







