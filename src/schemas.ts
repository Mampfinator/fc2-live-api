import { z } from "zod";

const boolNumber = z.number().min(0).max(1);

export const CHANNEL_SCHEMA = z.object({
    id: z.string(),
    bid: z.string(),
    fc2id: z.number(),
    title: z.string(),
    name: z.string(),
    image: z.string(),
    type: z.number().min(0).max(2),
    category: z.number(),
    sex: z.string(),
    lang: z.string(),
    count: z.number(),
    total: z.number(),
    login: z.number().min(0).max(2),
    video: boolNumber,
    app: boolNumber,
    pay: boolNumber,
    amount: z.number(),
    interval: z.number(),
    start_time: z.number(),
    start: z.string().regex(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/),
    comment_l: z.number(),
    price: z.number(),
    official: z.number(),
    comment_score: z.number(),
    deny_country_flg: z.string(),
    panorama: z.number(),
    tid: z.number(),
}).strict();

export const CHANNEL_LIST_SCHEMA = z.object({
    channel: z.array(CHANNEL_SCHEMA),
    is_adult: z.number(),
    link: z.string().url(),
    time: z.number(),
}).strict();

export const MEMBER_SCHEMA = z.object({
    channel_data: z.object({
        channelid: z.string(),
        userid: z.string(),
        title: z.string(),
        info: z.string(),
        category: z.string(),
        category_name: z.string(),
        adult: boolNumber,
        twoshot: boolNumber,
        login_only: z.number().min(0).max(2),
        is_publish: boolNumber,
        count: z.number(),
        image: z.string(),
        is_app: boolNumber,
        fee: boolNumber,
        amount: z.number(),
        interval: z.number(),
        start: z.number(),
        gift_limit: z.number(),
        gift_list: z.array(z.object({
            id: z.number(),
            type: z.number(),
            url: z.array(z.string()),
            name: z.string(),
        })),
        comment_limit: z.string(),
        tfollow: z.number(),
        tname: z.string(),
        is_official: boolNumber,
        is_premium_publisher: boolNumber,
        is_link_share: boolNumber,
        ticketid: z.number(),
        is_premium: boolNumber,
        ticket_price: z.number(),
        ticket_only: boolNumber,
        is_video: boolNumber,
        is_rest: boolNumber,
        is_limited: boolNumber,
        version: z.string(),
        fc2_channel: z.object({
            result: z.number(),
            userid: z.number(),
            fc2id: z.number(),
            adult: boolNumber,
            title: z.string(),
            description: z.string(),
            url: z.string(),
            images: z.array(z.string())
        }),
        control_tag: z.string(),
        publish_method: z.string(),

        // depending on whether a channel is marked as adult or not, these can be different types
        video_stereo3d: z.union([z.string().regex(/\d+/), z.number()]),
        video_mapping: z.union([z.string().regex(/\d+/), z.number()]),
        video_horizontal_view: z.union([z.string().regex(/\d+/), z.number()]),
    })
    .strict(),
    profile_data: z.object({
        userid: z.string(),
        fc2id: z.string(),
        name: z.string(),
        info: z.string(),
        age: z.string(),
        sex: z.string(),
        icon: z.string(),
        image: z.string(),
    })
    .strict(),
})
.strict();

export const MEMBER_RESPONSE_OK_SCHEMA = z.object({
    status: z.number().min(1).max(1),
    data: MEMBER_SCHEMA,
});

export const MEMBER_RESPONSE_ERROR_SCHEMA = z.object({
    status: z.number(),
    msg: z.string(),
});


export const MEMBER_RESPONSE_SCHEMA = z.union([
    MEMBER_RESPONSE_OK_SCHEMA,
    MEMBER_RESPONSE_ERROR_SCHEMA,
]);