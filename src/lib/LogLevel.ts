import { Chalk } from "chalk"

import { LogScope } from "./LogScope"

export default class LogLevel {
    public readonly name: string
    public readonly color: Chalk
    public readonly priority: number
    public readonly scope: LogScope

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
