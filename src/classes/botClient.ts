import { Client, Collection } from "discord.js";
import { TextCommand } from "../structures/textCommand.js";
import { SlashCommand } from "../structures/slashCommand.js";
import { Config, Log } from "../index.js";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { walkDirectory } from "../utils/helpers.js";
import { BotEvent } from "../structures/botEvent.js";

export class BotClient extends Client {
    public Commands: {
        text: Collection<string, TextCommand>;
        slash: Collection<string, SlashCommand>;
    };

    constructor() {
        super({
            intents: [
                "GuildMembers",
                "GuildMessages",
                "Guilds",
                "MessageContent",
                "GuildVoiceStates",
            ],
            allowedMentions: {
                parse: ["users", "roles"],
                repliedUser: true,
            },
            presence: {
                activities: [
                    {
                        name: "Hamster Dance",
                        type: 2,
                    },
                ],
                status: "online",
            },
        });

        this.Commands = {
            text: new Collection(),
            slash: new Collection(),
        };

        Log.Info("BotClient initalized!", "BotClient");
    }

    public async loadCommands(): Promise<void> {
        Log.Info("Searching for command files", "CommandHandler");
        const base_path = path.join(
            path.dirname(path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/")),
            "commands"
        );
        const textCommandFiles = await walkDirectory(path.join(base_path, "text"), [".ts", ".js"]);
        Log.Info(`Found ${textCommandFiles.length} text commands`, "CommandHandler");
        const slashCommandFiles = await walkDirectory(path.join(base_path, "slash"), [
            ".ts",
            ".js",
        ]);
        Log.Info(`Found ${slashCommandFiles.length} slash commands`, "CommandHandler");

        Log.Info(`Beginning to parse command files...`, "CommandHandler");

        // loop through text command files
        // check if text command file is valid
        for (let i = 0; i < textCommandFiles.length; i++) {
            const textCommandFile = textCommandFiles[i];
            const commandFile = await import(pathToFileURL(textCommandFile).href);

            if (commandFile.default instanceof TextCommand) {
                if (commandFile.default.name) {
                    Log.Info(`Loaded text command: ${commandFile.default.name}`, "CommandHandler");
                    this.Commands.text.set(commandFile.default.name, commandFile.default);
                } else {
                    Log.Warn(`Text command file ${textCommandFile} has no name`, "CommandHandler");
                }
            } else {
                Log.Warn(
                    `Text command file ${textCommandFile} is not of a TextCommand instance`,
                    "CommandHandler"
                );
            }
        }
    }

    public async loadEvents(): Promise<void> {
        Log.Info("Searching for event files", "EventHandler");
        const base_path = path.join(
            path.dirname(path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/")),
            "events"
        );
        const eventFiles = await walkDirectory(base_path, [".ts", ".js"]);
        Log.Info(`Found ${eventFiles.length} events`, "EventHandler");

        Log.Info(`Beginning to parse event files...`, "EventHandler");

        // loop through event files
        // check if event file is valid
        for (let i = 0; i < eventFiles.length; i++) {
            const eventFile = eventFiles[i];
            const event = await import(pathToFileURL(eventFile).href);

            if (event.default instanceof BotEvent) {
                if (event.default.name) {
                    Log.Info(`Loaded Event: ${event.default.name}`, "EventHandler");
                    this.on(event.default.name, event.default.run);
                } else {
                    Log.Warn(`Event file ${eventFile} has no name`, "EventHandler");
                }
            } else {
                Log.Warn(`Event file ${eventFile} is not of a BotEvent instance`, "EventHandler");
            }
        }
    }

    public async loadModules(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.loadCommands();
                await this.loadEvents();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public start(): Promise<string> {
        return this.login(Config.botToken);
    }

    public stop(): void {
        this.destroy();
    }
}
