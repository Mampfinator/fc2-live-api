import { APIStreamChatType, APIWatchability, StreamChatType, Watchability } from "./types";
export declare const BASE_URL = "https://live.fc2.com/";
export declare function makePath(...paths: string[]): string;
/**
 * Like Number(n), but treats undefined as 0.
 */
export declare function toNumber(boolean?: boolean): number;
export declare const WATCHABILITY_LOOKUP: Record<APIWatchability, Watchability>;
export declare const STREAM_CHAT_TYPE_LOOKUP: Record<APIStreamChatType, StreamChatType>;
