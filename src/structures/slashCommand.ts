export class SlashCommand {
    constructor(options: SlashCommandOptions) {
        Object.assign(this, options);
    }
}

interface SlashCommandOptions {}
