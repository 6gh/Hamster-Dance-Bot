import { Log } from "../index.js";
import { BotEvent } from "../structures/botEvent.js";

export default new BotEvent({
    name: "ready",
    run: (client) => {
        Log.Info(`Logged in as ${client.user.tag}`, "ReadyEvent");
    },
});
