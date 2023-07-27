import { Client, Config, Log } from "../index.js";
import { BotEvent } from "../structures/botEvent.js";

export default new BotEvent({
    name: "messageCreate",
    run: async (message) => {
        if (message.author.bot || !message.content.startsWith(Config.prefix) || !message.guild)
            return;

        const args = message.content.slice(Config.prefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        if (!command) return;

        const cmd =
            Client.Commands.text.get(command) ||
            Client.Commands.text.find((cmd) => cmd.aliases?.includes(command));

        if (cmd) {
            try {
                await cmd.run({ message, args, client: Client });
            } catch (error) {
                Log.Error(error, `${cmd.name} command`);
                await message
                    .reply(
                        ":headstone: There was an error trying to execute that command, please try again later."
                    )
                    .catch((err) => {
                        Log.Error(err, "MessageCreate");
                    });
            }
        }
    },
});
