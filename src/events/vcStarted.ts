import { Config, Log } from "../index.js";
import { BotEvent } from "../structures/botEvent.js";
import {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
} from "@discordjs/voice";

export default new BotEvent({
    name: "voiceStateUpdate",
    run: (oldState, newState) => {
        if (newState.member?.user.bot) return;

        if (newState.channelId !== null && !newState.guild.members.me?.voice?.channelId) {
            Log.Debug("user joined channel", "voiceStateUpdate");
            if (newState.channel?.name === Config.channelName) {
                if (newState.channel.joinable) {
                    Log.Debug("attempting to join", "voiceStateUpdate");
                    const connection = joinVoiceChannel({
                        channelId: newState.channel.id,
                        guildId: newState.guild.id,
                        adapterCreator: newState.guild.voiceAdapterCreator,
                    });
                    const player = createAudioPlayer({
                        behaviors: {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    });

                    let resource = createAudioResource(Config.audioFile);
                    Log.Debug("playing", "voiceStateUpdate");
                    player.play(resource);
                    player.on(AudioPlayerStatus.Idle, () => {
                        Log.Debug("looping", "voiceStateUpdate");
                        resource = createAudioResource(Config.audioFile);
                        player.play(resource);
                    });

                    connection.subscribe(player);
                }
            }
        } else {
            if (oldState.channel?.name === Config.channelName) {
                if (oldState.channel.members.size === 1) {
                    const connection = getVoiceConnection(oldState.guild.id);
                    connection?.destroy();
                }
            }
        }
    },
});
