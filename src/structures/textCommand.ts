import { BotClient } from "../classes/botClient.js";
import { Message } from "discord.js";

export class TextCommand {
    public name: string;
    public description: string;
    public run: (options: TextCommandRunOptions) => any | Promise<any>;
    public aliases?: string[];
    public category?: string;
    public usage?: string;

    constructor(options: TextCommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
        this.aliases = options.aliases;
        this.category = options.category;
        this.usage = options.usage;
    }
}

interface TextCommandOptions {
    name: string;
    description: string;
    run: (options: TextCommandRunOptions) => any | Promise<any>;
    aliases?: string[];
    category?: string;
    usage?: string;
}

interface TextCommandRunOptions {
    message: Message;
    args: string[];
    client: BotClient;
}
