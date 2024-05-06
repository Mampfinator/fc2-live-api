import { z } from "zod";
import { CHANNEL_LIST_SCHEMA, CHANNEL_SCHEMA, MEMBER_RESPONSE_ERROR_SCHEMA, MEMBER_RESPONSE_OK_SCHEMA, MEMBER_RESPONSE_SCHEMA, MEMBER_SCHEMA } from "./schemas";
export declare enum APIWatchability {
    Unlimited = 0,
    LoginRequired = 1,
    PointsRequired = 2
}
export declare enum APIStreamChatType {
    Open = 0,
    MultiPerson = 1,
    OneToOne = 2
}
export type MemberResponse = z.infer<typeof MEMBER_RESPONSE_SCHEMA>;
export type MemberResponseOk = z.infer<typeof MEMBER_RESPONSE_OK_SCHEMA>;
export type MemberResponseErr = z.infer<typeof MEMBER_RESPONSE_ERROR_SCHEMA>;
export type APIChannelListEntry = z.infer<typeof CHANNEL_SCHEMA>;
export type APIChannelListResponse = z.infer<typeof CHANNEL_LIST_SCHEMA>;
type RawAPIMember = z.infer<typeof MEMBER_SCHEMA>;
export type APIChannelData = RawAPIMember["channel_data"];
export type APIProfileData = RawAPIMember["profile_data"];
export interface APIMember<TChannel extends boolean, TProfile extends boolean> {
    channel_data: TChannel extends true ? APIChannelData : undefined;
    profile_data: TProfile extends true ? APIProfileData : undefined;
}
/**
 * Represents a member from /memberApi.php.
 */
export interface FC2Member<TChannel extends boolean = true, TProfile extends boolean = true> {
    channel: TChannel extends true ? Channel : undefined;
    profile: TProfile extends true ? Profile : undefined;
}
export declare enum Watchability {
    NoLoginRequired = "Unlimited",
    LoginRequired = "LoginRequired",
    PointsRequired = "PointsRequired"
}
export declare enum StreamChatType {
    Open = "Open",
    MultiPerson = "MultiPerson",
    OneOnOne = "OneOnOne"
}
export interface Channel {
    channelId: string;
    userId: string;
    title: string;
    info: string;
    categoryId: string;
    categoryName: string;
    adult: boolean;
    oneOnOne: boolean;
    loginRequired: Watchability;
    isLive: boolean;
    viewers: number;
    image: string;
    isApp: boolean;
    isPaid: boolean;
    interval: number;
    start: Date;
}
export interface Profile {
    userId: string;
    fc2Id: string;
    name: string;
    info: string;
    age: number;
    sex: string;
    icon: string;
    image: string;
}
export {};
