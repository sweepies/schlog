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

    /**
     * Get the name
     */
    public getName() {
        return this.name
    }

    /**
     * Get the color
     */
    public getColor() {
        return this.color
    }

    /**
     * Get the priority
     */
    public getPriority() {
        return this.priority
    }

    /**
     * Get the scope
     */
    public getScope() {
        return this.scope
    }
}
