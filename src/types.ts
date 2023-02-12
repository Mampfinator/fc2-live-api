export enum APIWatchability {
    Unlimited = 0,
    LoginRequired = 1,
    PointsRequired = 2,
}

export enum APIStreamChatType {
    Open = 0,
    MultiPerson = 1,
    OneToOne = 2,
}


export type APIResponse<TData, TStatus = number> = {
    status: number;
    data: TData;
    msg: TStatus extends 1 ? undefined : string;
}


export interface APIChannelListEntry {
    id: string;
    title: string;
    name: string;
    image: string;
    type: APIStreamChatType;
    caegory: number;
    sex: string;
    lang: string;
    count: number;
    total: number;
    login: APIWatchability,
    video?: 1;
    app?: 1;
    pay: 0 | 1;
    amount: number;
    interval: number;
    start_time: string;
}

export interface APIChannelListResponse {
    channel: APIChannelListEntry[];
    is_adult: 0 | 1;
    link: string;
    time: number;
}

export interface APIMember<TChannel extends boolean, TProfile extends boolean> {
    channel_data: TChannel extends true ? APIChannelData : undefined;
    profile_data: TProfile extends true ? APIProfileData : undefined;
}


export interface APIChannelData {
    channelid: string;
    userid: string;
    title: string;
    info: string;
    category: number;
    category_name: string;
    adult: 0 | 1;
    twoshot?: 1;
    login_only: APIWatchability;
    is_publish: 0 | 1;
    count: number;
    image: string;
    is_app?: 1;
    fee: boolean;
    interval: number;
    start: string;
}

export interface APIProfileData {
    userid: string;
    fc2id: string;
    name: string;
    info: string;
    age: number;
    sex: string;
    icon: string;
    image: string;
}

export interface FC2Member<TChannel extends boolean = true, TProfile extends boolean = true> {
    channel: TChannel extends true ? Channel : undefined;
    profile: TProfile extends true ? Profile : undefined;
}

export enum Watchability {
    NoLoginRequired = "Unlimited",
    LoginRequired = "LoginRequired", 
    PointsRequired = "PointsRequired"
}

export enum StreamChatType {
    Open = "Open",
    MultiPerson = "MultiPerson",
    OneOnOne = "OneOnOne",
}

export interface Channel {
    channelId: string;
    userId: string;
    title: string;
    info: string;
    categoryId: number;
    categoryName: string;

    adult: boolean;
    oneOnOne: boolean;
    loginRequired: Watchability;
    isLive: boolean;
    viewers: number;
    image: string;
    isApp: boolean;
    fee: boolean;
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