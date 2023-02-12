import EventEmitter3 from "eventemitter3";
import { FC2ApiError } from "./FC2ApiError";
import { ChannelManager } from "./ChannelManager";
import type { FC2Member } from "./types";

export type ClientEvents = {
    "channel:live": (member: FC2Member) => void;
    "channel:offline": (member: FC2Member) => void;
    error: (error: FC2ApiError) => void;
    ready: () => void;
}

export interface FC2ClientOptions {
    /**
     * Currently unused.
     */
    token?: string;
}

export class FC2Client extends EventEmitter3<ClientEvents> {
    public readonly channels = new ChannelManager(this);
    public readonly token?: string;

    constructor(
        options?: FC2ClientOptions,
    ) {
        super();

        if (options) {
            this.token = options.token;
        }
    }

    /**
     * Starts event generator.
     */
    public async start() {
        return this.channels.start();
    }
}

