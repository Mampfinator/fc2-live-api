import EventEmitter3 from "eventemitter3";
import { FC2Error } from "./errors";
import { ChannelManager } from "./ChannelManager";
import type { FC2Member } from "./types";

export type ClientEvents = {
    "channel:live": (member: FC2Member) => void;
    "channel:offline": (member: FC2Member) => void;
    error: (error: FC2Error) => void;
    ready: () => void;
}

export interface FC2ClientOptions {
    /**
     * Currently unused.
     */
    token?: string;

    /**
     * If set, skips starting the channel events generator. 
     * Can be manually started with `FC2Client#start` or `ChannelManager#start`.
     */
    noEvents?: boolean;
}

export class FC2Client extends EventEmitter3<ClientEvents> {
    public readonly channels = new ChannelManager(this);
    public readonly token?: string;

    constructor(
        options?: FC2ClientOptions,
    ) {
        super();

        this.token = options?.token;
        if (!options?.noEvents) {
            this.start();
        }
    }

    /**
     * Starts event generator.
     */
    public async start() {
        return this.channels.start();
    }
}

