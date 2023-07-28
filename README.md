# Hamster Dance Bot

A Discord bot that plays the Hamster Dance song in a voice channel

## Usage

You can [self-host](#self-hosting) this bot if you so wish, or you can [invite the bot hosted by me](https://discord.com/api/oauth2/authorize?client_id=1003695933881593917&permissions=36703232&scope=bot)

When you add the bot, join a voice channel called #hamster, it will then join and start playing the Hamster Dance Song!

## Self Hosting

You can host this bot yourself by following the steps below

1. Clone this repo
2. Set BOT_TOKEN in .env to your Discord bot's token. Get this from the [Discord Developer Portal](https://discord.com/developers/applications/)
3. Run `pnpm install` to install the package dependencies.
4. Run `pnpm start` to build and start the bot!
5. That's it! Use the bot the same as in [Usage](#usage)

### Customizable options

If you go through the [self-hosting route](#self-hosting), you are able to change the channel name to monitor, the audio file to play, and the prefix. These settings are in the file, `config.ts` found in the root of the project.

The settings consist of the following

| Name        | Description                                                        | Default                       |
| ----------- | ------------------------------------------------------------------ | ----------------------------- |
| Prefix      | The bot prefix for text commands                                   | "-"                           |
| ChannelName | The name of the channel to monitor                                 | "hamster"                     |
| AudioFile   | The path of the file that will play when someone joins ChannelName | "./The HamsterDance Song.mp3" |

> NOTE: AudioFile is relative to where you are running the bot from! If you use `pnpm start`, chances are that this is the root of the project

> CAUTION: ChannelName is case sensitive!

If you are using my bot, you cannot change these at the moment
