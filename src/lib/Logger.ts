import chalk from "chalk"
import * as moment from "moment"
import { EOL } from "os"

import LogLevel from "./LogLevel"
import { LogScope } from "./LogScope"

export class Logger {
    private static readonly logLevels: LogLevel[] = [
        new LogLevel("error", chalk.red.bold, 0, LogScope.STDERR),
        new LogLevel("warn", chalk.yellow.bold, 1, LogScope.STDERR),
        new LogLevel("info", chalk.green.bold, 2, LogScope.STDOUT),
        new LogLevel("debug", chalk.blue.bold, 3, LogScope.STDOUT),
    ]
    private static readonly defaultLogLevel: LogLevel = Logger.logLevels[2]
    private static logLevel: LogLevel
    private static printTimestamps: boolean = true
    private static timeFormat: string = "HH:mm:ss"
    private static printJson: boolean

    /**
     * Get all of the defined log levels
     */
    public static getLogLevels() {
        return this.logLevels
    }

    /**
     * Get the default log level
     */
    public static getDefaultLogLevel() {
        return this.defaultLogLevel
    }

    /**
     * Set the log level
     * @param level The level to set
     */
    public static setLogLevel(level: LogLevel) {
        this.logLevel = level
    }

    /**
     * Get the current log level
     */
    public static getLogLevel() {
        return this.logLevel
    }

    /**
     * Enable or disable printing timestamps
     * @param bool True for enabled, false for disabled
     */
    public static setPrintTimestamps(bool: boolean) {
        this.printTimestamps = bool
    }

    /**
     * Enable or disable JSON printing
     * @param format True for enabled, false for disabled
     */
    public static setPrintJson(bool: boolean) {
        this.printJson = bool
    }

    /**
     * Sets the Moment.js time format. Defaults to "HH:mm:ss".
     * @param format The time format
     */
    public static setTimeFormat(format: string) {
        this.timeFormat = format
    }

    /**
     * Get the current time format
     */
    public static getTimeFormat() {
        return this.timeFormat
    }

    /**
     * Find a log level from its name
     * @param name The name
     */
    public static getLogLevelByName(name: string) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.name === name)]
    }

    /**
     * Find a log level from its priority
     * @param priority The priority
     */
    public static getLogLevelByPriority(priority: number) {
        return this.logLevels[this.logLevels.findIndex((l: any) => l.priority === priority)]
    }

    /**
     * Format a message
     * @param level The log level to format for
     * @param message The message
     */
    public static format(level: LogLevel, message: any) {
        let line = `${level.getColor()(level.getName().toUpperCase())} ${message}`
        if (this.printTimestamps) {
            line = `[${chalk.gray(moment().format(this.timeFormat))}] ` + line
        }
        return line
    }

    /**
     * Format a message in JSON
     * @param level The log level to format for
     * @param message The message
     */
    public static formatJson(level: LogLevel, message: any) {
        // we want time to be first in the string
        const object: any = {}
        if (this.printTimestamps) {
            object.time = moment().format(this.timeFormat)
        }
        object.level = level
        object.message = message
        const line = JSON.stringify(object)
        return line
    }

    /**
     * Log a message
     * @param level The level to log in
     * @param message The message
     */
    public static log(level: LogLevel, message: string) {
        // console.log(this.logLevel.priority, "against", level.priority)
        if (this.logLevel.getPriority() >= level.getPriority()) {
            const line = this.printJson ? this.formatJson(level, message) : this.format(level, message)
            level.getScope() === LogScope.STDERR ? process.stderr.write(line + EOL) : process.stdout.write(line + EOL)
            return line
        }
    }

    /**
     * Format a message with the error log level
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line (without newline) or nothing if the log level wasn't high enough
     */
    public static async error(message: any): Promise<string | void> {
        return this.log(this.logLevels[0], message)
    }

    /**
     * Format a message with the warn log level
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line (without newline) or nothing if the log level wasn't high enough
     */
    public static async warn(message: any): Promise<string | void> {
        return this.log(this.logLevels[1], message)
    }

    /**
     * Format a message with the info log level
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line or nothing if the log level wasn't high enough
     */
    public static async info(message: any): Promise<string | void> {
        return this.log(this.logLevels[2], message)
    }

    /**
     * Format a message with the debug log level
     * @param message The message
     * @param json Whether or not to format in json
     * @returns The log line or nothing if the log level wasn't high enough
     */
    public static async debug(message: any): Promise<string | void> {
        return this.log(this.logLevels[3], message)
    }

}

// set level from env
if (process.env.LOG_LEVEL === undefined) {
    Logger.setLogLevel(Logger.getDefaultLogLevel())
} else {
    const fromName = Logger.getLogLevelByName(process.env.LOG_LEVEL)
    if (fromName === undefined) {
        const fromInt = Logger.getLogLevelByPriority(parseInt(process.env.LOG_LEVEL, 10))
        if (fromInt === undefined) {
            Logger.setLogLevel(Logger.getDefaultLogLevel())
        } else {
            Logger.setLogLevel(fromInt)
        }
    } else {
        Logger.setLogLevel(fromName)
    }
}

Logger.debug("Using log level: " + Logger.getLogLevel().getName())
