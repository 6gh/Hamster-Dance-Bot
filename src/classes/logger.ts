import chalkTemplate from "chalk-template";
import { Config } from "../index.js";
import { createWriteStream, existsSync } from "fs";
import { mkdir } from "fs/promises";

export class Logger {
    public logToFile: boolean;
    private logFile: string;

    constructor() {
        this.logToFile = Config.logFile;
        const date = new Date();
        const [year, month, day, hour, minute, second] = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ];

        if (this.logToFile) {
            if (Config.nodeEnv === "development") {
                this.logFile = `./logs/debug.log`;
            } else {
                this.logFile = `./logs/${year}-${month}-${day}_${hour}-${minute}-${second}.log`;
            }

            this.AddHeading();
        } else {
            this.logFile = "./none.log";
        }
    }

    private async AddHeading() {
        let msg = `====================\nSTART OF LOG, ${new Date().toLocaleString()}\n====================`;

        this._SaveToFile(msg);
    }

    public async Info(message: any, owner?: string) {
        if (message instanceof Error) {
            this.Error(message, owner);
        } else if (typeof message === "object") {
            message = JSON.stringify(message, null, 2);
        }

        // generate message for file
        let title = this._GenerateTitle("INFO", owner, false);

        let msg = `${title} ${message}`;

        if (this.logToFile) {
            this._SaveToFile(msg);
        }

        // generate message for console
        if (Config.useChalk) {
            console.log(`${this._GenerateTitle("INFO", owner, true)} ${message}`);
        } else {
            console.log(msg);
        }
    }

    public async Warn(message: any, owner?: string) {
        if (message instanceof Error) {
            this.Error(message, owner);
        } else if (typeof message === "object") {
            message = JSON.stringify(message, null, 2);
        }

        // generate message for file
        let title = this._GenerateTitle("WARN", owner, false);

        let msg = `${title} ${message}`;

        if (this.logToFile) {
            this._SaveToFile(msg);
        }

        // generate message for console
        if (Config.useChalk) {
            console.log(`${this._GenerateTitle("WARN", owner, true)} ${message}`);
        } else {
            console.log(msg);
        }
    }

    public async Error(message: any, owner?: string) {
        if (message instanceof Error) {
            message = `${message.message}\n${message.stack?.split("\n").join("\n- ")}`; // add a - to each line of the stack trace
        } else if (typeof message === "object") {
            message = JSON.stringify(message, null, 2);
        }

        // generate message for file
        let title = this._GenerateTitle("ERROR", owner, false);

        let msg = `${title} ${message}`;

        if (this.logToFile) {
            this._SaveToFile(msg);
        }

        // generate message for console
        if (Config.useChalk) {
            console.log(
                chalkTemplate`${this._GenerateTitle("ERROR", owner, true)} {red ${message}}`
            );
        } else {
            console.log(msg);
        }
    }

    public async Debug(message: any, owner?: string) {
        if (Config.nodeEnv === "production") return;

        if (message instanceof Error) {
            this.Error(message, owner);
        } else if (typeof message === "object") {
            message = JSON.stringify(message, null, 2);
        }

        // generate message for file
        let title = this._GenerateTitle("DEBUG", owner, false);

        let msg = `${title} ${message}`;

        if (this.logToFile) {
            this._SaveToFile(msg);
        }

        // generate message for console
        if (Config.useChalk) {
            console.log(chalkTemplate`${this._GenerateTitle("DEBUG", owner, true)} ${message}`);
        } else {
            console.log(msg);
        }
    }

    private async _SaveToFile(message: string) {
        if (!existsSync("./logs")) {
            await mkdir("./logs");
        }

        const stream = createWriteStream(this.logFile, { flags: "a" });
        stream.write(message + "\n");
        stream.close();
    }

    private _GenerateTitle(
        type: "INFO" | "WARN" | "ERROR" | "DEBUG",
        owner?: string,
        color?: boolean
    ) {
        switch (type) {
            case "INFO":
                if (color !== true) {
                    let title = `[${new Date().toLocaleTimeString()}] [${type}]`;

                    if (owner) {
                        title += ` [${owner}]`;
                    }

                    return title;
                } else {
                    let title = chalkTemplate`{dim [${new Date().toLocaleTimeString()}]} {blue [${type}]}`;

                    if (owner) {
                        title += chalkTemplate` {gray.underline [${owner}]}`;
                    }

                    return title;
                }
            case "WARN":
                if (color !== true) {
                    let title = `[${new Date().toLocaleTimeString()}] [${type}]`;

                    if (owner) {
                        title += ` [${owner}]`;
                    }

                    return title;
                } else {
                    let title = chalkTemplate`{dim [${new Date().toLocaleTimeString()}]} {bgYellow [${type}]}`;

                    if (owner) {
                        title += chalkTemplate` {gray.underline [${owner}]}`;
                    }

                    return title;
                }
            case "ERROR":
                if (color !== true) {
                    let title = `[${new Date().toLocaleTimeString()}] [${type}]`;

                    if (owner) {
                        title += ` [${owner}]`;
                    }

                    return title;
                } else {
                    let title = chalkTemplate`{dim [${new Date().toLocaleTimeString()}]} {bgRed [${type}]}`;

                    if (owner) {
                        title += chalkTemplate` {gray.underline [${owner}]}`;
                    }

                    return title;
                }
            case "DEBUG":
                if (color !== true) {
                    let title = `[${new Date().toLocaleTimeString()}] [${type}]`;

                    if (owner) {
                        title += ` [${owner}]`;
                    }

                    return title;
                } else {
                    let title = chalkTemplate`{dim [${new Date().toLocaleTimeString()}]} {bgWhite [${type}]}`;

                    if (owner) {
                        title += chalkTemplate` {gray.underline [${owner}]}`;
                    }

                    return title;
                }
            default:
                if (color !== true) {
                    let title = `[${new Date().toLocaleTimeString()}] [${type}]`;

                    if (owner) {
                        title += ` [${owner}]`;
                    }

                    return title;
                } else {
                    let title = chalkTemplate`{dim [${new Date().toLocaleTimeString()}]} {bgGray [UNKNOWN]}`;

                    if (owner) {
                        title += chalkTemplate` {gray.underline [${owner}]}`;
                    }

                    return title;
                }
                break;
        }
    }
}
