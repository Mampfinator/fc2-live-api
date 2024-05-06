import EventEmitter3 from "eventemitter3";
import { Result } from "neverthrow";
import { FC2Error } from "./errors";
import { FC2Client } from "./FC2Client";
import { APIChannelListResponse, FC2Member } from "./types";
export type ChannelEvents = {
    live: (member: FC2Member) => void;
    offline: (member: FC2Member) => void;
    error: (error: FC2Error) => void;
    ready: () => void;
};
export declare class ChannelManager extends EventEmitter3<ChannelEvents> {
    private readonly client;
    /**
     * Used to track channels that are currently live.
     */
    readonly liveIds: Set<string>;
    private interval;
    constructor(client: FC2Client);
    /**
     * @param id the channel ID of the member you want to fetch. For, say, `https://live.fc2.com/49286435/`, that's "49286435".
     */
    fetchMember<TChannel extends boolean, TProfile extends boolean>(id: string, options: {
        channel?: TChannel;
        profile?: TProfile;
    }): Promise<Result<FC2Member<TChannel, TProfile>, FC2Error>>;
    fetchAll(adult: boolean): Promise<APIChannelListResponse>;
    /**
     * Gets all channel IDs and calculates differences between last known live.
     */
    private getChannelChanges;
    private sync;
    private triggerEvents;
    /**
     * Stops live fetching for channels. Events will stop being emitted.
     */
    stop(): void;
    /**
     * Starts live fetching for channels and syncs status with API.
     */
    start(): Promise<void>;
}
