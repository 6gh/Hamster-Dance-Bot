import { TextCommand } from "../../../structures/textCommand.js";

export default new TextCommand({
    name: "ping",
    description: "Pong!",
    aliases: ["pong"],
    category: "bot",
    run: async ({ message }) => {
        const msg = await message.reply("Ping?");
        msg.edit(
            `Pong! Latency is ${Math.floor(
                msg.createdTimestamp - message.createdTimestamp
            )}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`
        );
    },
});
