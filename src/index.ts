/**
 * Imports
 */
import "dotenv/config";
import { parseVariables } from "./parseVariables.js";
import { Logger } from "./classes/logger.js";
import { BotClient } from "./classes/botClient.js";

/**
 * Set constants and variables
 */
export const Config = parseVariables();
export const Log = new Logger();
export const Client = new BotClient();

/**
 * Actual part that runs the bot
 */
Log.Info("Starting!");

Client.loadModules()
    .then(() => {
        Client.start();
    })
    .catch((err) => {
        Log.Error(err, "BotClient");
    });
