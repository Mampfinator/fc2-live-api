import EventEmitter3 from "eventemitter3";
import { err, ok, Result } from "neverthrow";
import { request } from "undici";
import { ZodError } from "zod";
import { FC2ApiError, FC2ClientError, FC2Error } from "./errors";
import { FC2Client } from "./FC2Client";
import { MEMBER_RESPONSE_SCHEMA } from "./schemas";
import { APIChannelListResponse, APIMember, APIWatchability, FC2Member, MemberResponse, MemberResponseErr, MemberResponseOk } from "./types";
import { makePath, toNumber, WATCHABILITY_LOOKUP } from "./util";

export type ChannelEvents = {
    live: (member: FC2Member) => void;
    offline: (member: FC2Member) => void;
    error: (error: FC2Error) => void;
    ready: () => void;
}

export class ChannelManager extends EventEmitter3<ChannelEvents> {
    /**
     * Used to track channels that are currently live.
     */
    public readonly liveIds: Set<string> = new Set();
    private interval!: NodeJS.Timeout;

    constructor(
        private readonly client: FC2Client
    ) {
        super();
        this.on("live", member => {
            this.client.emit("channel:live", member);
        });

        this.on("ready", () => {
            this.client.emit("ready")
        });

        this.on("offline", member => {
            this.client.emit("channel:offline", member);
        });

        this.on("error", error => {
            this.client.emit("error", error);
        });
    }

    /**
     * @param id the channel ID of the member you want to fetch. For, say, `https://live.fc2.com/49286435/`, that's "49286435".
     */
    public async fetchMember<TChannel extends boolean, TProfile extends boolean>(id: string, options: {channel?: TChannel, profile?: TProfile}): Promise<Result<FC2Member<TChannel, TProfile>, FC2Error>> {
        const url = makePath("api", "memberApi.php");
        
        const query = Object.fromEntries([
            ["channel", toNumber(options.channel)], 
            ["profile", toNumber(options.profile)]
        ].filter(([_, value]) => value)); 

        const response = await request(url, {
            query: {...query, streamid: id},
        })
        .then(res => res.body.json())
        .then(body => MEMBER_RESPONSE_SCHEMA.safeParse(body));

        if (!response.success) {
            return err(new FC2ClientError<ZodError>("Zod validation failed", response.error));
        }

        const {data} = response;

        const { status } = data; 
        if (status !== 1) {
            const { msg } = data as MemberResponseErr;
            return err(new FC2ApiError(status, msg, url));
        }

        const {profile_data, channel_data} = (data as MemberResponseOk).data;

        const entries = [];

        if (profile_data) {
            const {
                userid: userId,
                fc2id: fc2Id,
                name, info, age, sex, icon, image,
            } = profile_data;


            const profile: FC2Member<false, true>["profile"] = {
                userId,
                fc2Id,
                name, 
                info, 
                age: Number(age),
                sex, 
                icon,
                image,
            }

            entries.push(
                ["profile", profile],
            );
        }

        if (channel_data) {
            const {
                channelid: channelId,
                userid: userId,
                title,
                info,
                category: categoryId,
                category_name: categoryName,
                adult,
                twoshot,
                login_only,
                is_publish,
                count,
                image,
                is_app,
                fee,
                interval,
                start,
            } = channel_data;

            const channel: FC2Member<true, false>["channel"] = {
                channelId, 
                userId, 
                title, 
                info,
                categoryId: Number(categoryId),
                categoryName,
                adult: Boolean(adult),
                oneOnOne: Boolean(twoshot),
                loginRequired: WATCHABILITY_LOOKUP[login_only as APIWatchability],
                isLive: Boolean(is_publish),
                viewers: count,
                image,
                isApp: Boolean(is_app), 
                fee: Boolean(fee),
                interval,
                start: new Date(start),
            }

            entries.push(
                ["channel", channel],
            );
        }

        return ok(Object.fromEntries(entries) as FC2Member<TChannel, TProfile>);

    }


    public async fetchAll(adult: boolean): Promise<APIChannelListResponse> {
        const url = makePath(...[adult ? "adult" : undefined, "contents", "allchannellist.php"].filter(Boolean) as string[]);
        return await request(url).then(res => res.body.json());
    }

    /**
     * Gets all channel IDs and calculates differences between last known live.
     */
    private async getChannelChanges(): Promise<{live: string[], offline: string[]}> {
        const [
            {channel: safeChannels},
            {channel: adultChannels}
        ] = await Promise.all([
            this.fetchAll(false),
            this.fetchAll(true),   
        ]);

        const channels = new Set([...safeChannels.map(({id}) => id), ...adultChannels.map(({id}) => id)]);

        const wentOffline = new Set([...this.liveIds].filter(id => !channels.has(id)));
        const wentLive = new Set([...channels].filter(id => !this.liveIds.has(id)));

        console.debug(`Total: ${channels.size} (${safeChannels.length} safe; ${adultChannels.length} adult) - Went Live: ${wentLive.size}; Went Offline: ${wentOffline.size}.`);

        return {
            live: [...wentLive],
            offline: [...wentOffline],
        }
    }

    private async sync({live, offline}: {live: string[], offline: string[]}) {
        for (const channelId of live) {
            this.liveIds.add(channelId);
        }

        for (const channelId of offline) {
            this.liveIds.delete(channelId);
        }
    }

    private async triggerEvents({live, offline}: {live: string[], offline: string[]}) {
        const [
            liveChannels,
            offlineChannels
        ] = await Promise.all([
            Promise.all(live.map(channelId => this.fetchMember(channelId, {channel: true, profile: true}))),
            Promise.all(offline.map(channelId => this.fetchMember(channelId, {channel: true, profile: true})))
        ]);

        for (const result of liveChannels) {
            if (result.isErr()) {
                this.emit("error", result.error);
                continue;
            }
            this.emit("live", result.value);
        }

        for (const result of offlineChannels) {
            if (result.isErr()) {
                this.emit("error", result.error);
                continue;
            }

            this.emit("offline", result.value);
        }
    }


    /**
     * Stops live fetching for channels. Events will stop being emitted.
     */
    public stop() {
        clearInterval(this.interval);
    }

    /**
     * Starts live fetching for channels and syncs status with API.
     */
    public async start() {
        const status = await this.getChannelChanges();
        this.sync(status);

        this.interval = setInterval(async () => {
            const status = await this.getChannelChanges();
            this.sync(status);
            this.triggerEvents(status);
        }, 30_000); 


        this.emit("ready");
    }
}