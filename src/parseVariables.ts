import { Prefix } from "../config.js";

/**
 * Parse the environment variables and config.ts into a single object
 */
export function parseVariables(): Variables {
    // check required variables
    if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is not set");

    // return variables
    return {
        nodeEnv: process.env.NODE_ENV === "production" ? "production" : "development",
        logFile: process.env.LOG_FILE === "true",
        useChalk: process.env.USE_CHALK === "true",
        botToken: process.env.BOT_TOKEN,

        prefix: Prefix || "!",
    };
}

interface Variables {
    nodeEnv: "development" | "production";
    logFile: boolean;
    useChalk: boolean;
    botToken: string;

    prefix: string;
}
