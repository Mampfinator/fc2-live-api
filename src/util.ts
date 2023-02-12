import { join } from "path";
import { APIStreamChatType, APIWatchability, StreamChatType, Watchability } from "./types";

export const BASE_URL = "https://live.fc2.com/";

export function makePath(...paths: string[]): string {
    const path = join(...paths);
    return BASE_URL + path;
}

/**
 * Like Number(n), but treats undefined as 0.
 */
export function toNumber(boolean?: boolean): number {
    if (typeof boolean === "undefined") return 0;
    return Number(boolean);
}


export const WATCHABILITY_LOOKUP: Record<APIWatchability, Watchability> = {
    [APIWatchability.Unlimited]: Watchability.NoLoginRequired,
    [APIWatchability.LoginRequired]: Watchability.LoginRequired,
    [APIWatchability.PointsRequired]: Watchability.PointsRequired,
};

// currently unused
export const STREAM_CHAT_TYPE_LOOKUP: Record<APIStreamChatType, StreamChatType> = {
    [APIStreamChatType.Open]: StreamChatType.Open,
    [APIStreamChatType.MultiPerson]: StreamChatType.MultiPerson,
    [APIStreamChatType.OneToOne]: StreamChatType.OneOnOne,
}