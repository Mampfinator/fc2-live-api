"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelManager = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const neverthrow_1 = require("neverthrow");
const undici_1 = require("undici");
const errors_1 = require("./errors");
const schemas_1 = require("./schemas");
const util_1 = require("./util");
class ChannelManager extends eventemitter3_1.default {
    constructor(client) {
        super();
        this.client = client;
        /**
         * Used to track channels that are currently live.
         */
        this.liveIds = new Set();
        this.on("live", (member) => {
            this.client.emit("channel:live", member);
        });
        this.on("ready", () => {
            this.client.emit("ready");
        });
        this.on("offline", (member) => {
            this.client.emit("channel:offline", member);
        });
        this.on("error", (error) => {
            this.client.emit("error", error);
        });
    }
    /**
     * @param id the channel ID of the member you want to fetch. For, say, `https://live.fc2.com/49286435/`, that's "49286435".
     */
    fetchMember(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = (0, util_1.makePath)("api", "memberApi.php");
            const query = Object.fromEntries([
                ["channel", (0, util_1.toNumber)(options.channel)],
                ["profile", (0, util_1.toNumber)(options.profile)],
            ].filter(([_, value]) => value));
            const response = yield (0, undici_1.request)(url, {
                query: Object.assign(Object.assign({}, query), { streamid: id }),
            })
                .then((res) => res.body.json())
                .then((body) => schemas_1.MEMBER_RESPONSE_SCHEMA.safeParse(body));
            if (!response.success) {
                return (0, neverthrow_1.err)(new errors_1.FC2ClientError("Zod validation failed", response.error));
            }
            const { data } = response;
            const { status } = data;
            if (status !== 1) {
                const { msg } = data;
                return (0, neverthrow_1.err)(new errors_1.FC2ApiError(status, msg, url));
            }
            const { profile_data, channel_data } = data.data;
            const entries = [];
            if (profile_data) {
                const { userid: userId, fc2id: fc2Id, name, info, age, sex, icon, image, } = profile_data;
                const profile = {
                    userId,
                    fc2Id,
                    name,
                    info,
                    age,
                    sex,
                    icon,
                    image,
                };
                entries.push(["profile", profile]);
            }
            if (channel_data) {
                const { channelid: channelId, userid: userId, title, info, category: categoryId, category_name: categoryName, adult, twoshot: oneOnOne, login_only, is_publish: isLive, count: viewers, image, is_app: isApp, fee: isPaid, interval, start, } = channel_data;
                const channel = {
                    channelId,
                    userId,
                    title,
                    info,
                    categoryId,
                    categoryName,
                    adult,
                    oneOnOne,
                    loginRequired: util_1.WATCHABILITY_LOOKUP[login_only],
                    isLive,
                    viewers,
                    image,
                    isApp,
                    isPaid,
                    interval,
                    start: new Date(start),
                };
                entries.push(["channel", channel]);
            }
            return (0, neverthrow_1.ok)(Object.fromEntries(entries));
        });
    }
    fetchAll(adult) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = (0, util_1.makePath)(...[
                adult ? "adult" : undefined,
                "contents",
                "allchannellist.php",
            ].filter(Boolean));
            return yield (0, undici_1.request)(url)
                .then((res) => res.body.json())
                .then(body => schemas_1.CHANNEL_LIST_SCHEMA.parse(body));
        });
    }
    /**
     * Gets all channel IDs and calculates differences between last known live.
     */
    getChannelChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ channel: safeChannels }, { channel: adultChannels }] = yield Promise.all([this.fetchAll(false), this.fetchAll(true)]);
            const channels = new Set([
                ...safeChannels.map(({ id }) => id),
                ...adultChannels.map(({ id }) => id),
            ]);
            const wentOffline = new Set([...this.liveIds].filter((id) => !channels.has(id)));
            const wentLive = new Set([...channels].filter((id) => !this.liveIds.has(id)));
            console.debug(`Total: ${channels.size} (${safeChannels.length} safe; ${adultChannels.length} adult) - Went Live: ${wentLive.size}; Went Offline: ${wentOffline.size}.`);
            return {
                live: [...wentLive],
                offline: [...wentOffline],
            };
        });
    }
    sync({ live, offline, }) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channelId of live) {
                this.liveIds.add(channelId);
            }
            for (const channelId of offline) {
                this.liveIds.delete(channelId);
            }
        });
    }
    triggerEvents({ live, offline, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [liveChannels, offlineChannels] = yield Promise.all([
                Promise.all(live.map((channelId) => this.fetchMember(channelId, {
                    channel: true,
                    profile: true,
                }))),
                Promise.all(offline.map((channelId) => this.fetchMember(channelId, {
                    channel: true,
                    profile: true,
                }))),
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
        });
    }
    /**
     * Stops live fetching for channels. Events will stop being emitted.
     */
    stop() {
        clearInterval(this.interval);
    }
    /**
     * Starts live fetching for channels and syncs status with API.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.getChannelChanges();
            this.sync(status);
            this.interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const status = yield this.getChannelChanges();
                this.sync(status);
                this.triggerEvents(status);
            }), 30000);
            this.emit("ready");
        });
    }
}
exports.ChannelManager = ChannelManager;
