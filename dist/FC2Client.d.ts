import EventEmitter3 from "eventemitter3";
import { FC2Error } from "./errors";
import { ChannelManager } from "./ChannelManager";
import type { FC2Member } from "./types";
export type ClientEvents = {
    "channel:live": (member: FC2Member) => void;
    "channel:offline": (member: FC2Member) => void;
    error: (error: FC2Error) => void;
    ready: () => void;
};
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
export declare class FC2Client extends EventEmitter3<ClientEvents> {
    readonly channels: ChannelManager;
    readonly token?: string;
    constructor(options?: FC2ClientOptions);
    /**
     * Starts event generator.
     */
    start(): Promise<void>;
}
