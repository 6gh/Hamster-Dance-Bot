import { ClientEvents } from "discord.js";

export class BotEvent<K extends keyof ClientEvents> {
    constructor(options: EventOptions<K>) {
        Object.assign(this, options);
    }
}

interface EventOptions<K extends keyof ClientEvents> {
    name: K;
    run: (...args: ClientEvents[K]) => void | Promise<void>;
}
