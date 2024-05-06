import { z } from "zod";

export const CHANNEL_SCHEMA = z
    .object({
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
        video: z.coerce.boolean(),
        app: z.coerce.boolean(),
        pay: z.coerce.boolean(),
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
    })
    .strip();

export const CHANNEL_LIST_SCHEMA = z
    .object({
        channel: z.array(CHANNEL_SCHEMA),
        is_adult: z.number(),
        link: z.string().url(),
        time: z.number(),
    })
    .strip();

export const MEMBER_SCHEMA = z
    .object({
        channel_data: z
            .object({
                channelid: z.coerce.string(),
                userid: z.coerce.string(),
                title: z.string(),
                info: z.string(),
                category: z.coerce.string(),
                category_name: z.string(),
                adult: z.coerce.boolean(),
                twoshot: z.coerce.boolean(),
                login_only: z.number().min(0).max(2),
                is_publish: z.coerce.boolean(),
                count: z.number(),
                image: z.string(),
                is_app: z.coerce.boolean(),
                fee: z.coerce.boolean(),
                amount: z.number(),
                interval: z.number(),
                start: z.number(),
                gift_limit: z.number(),
                gift_list: z.array(
                    z.object({
                        id: z.number(),
                        type: z.number(),
                        url: z.array(z.string()),
                        name: z.string(),
                    })
                ),
                comment_limit: z.string(),
                tfollow: z.number(),
                tname: z.string(),
                is_official: z.coerce.boolean(),
                is_premium_publisher: z.coerce.boolean(),
                is_link_share: z.coerce.boolean(),
                ticketid: z.number(),
                is_premium: z.coerce.boolean(),
                ticket_price: z.number(),
                ticket_only: z.coerce.boolean(),
                is_video: z.coerce.boolean(),
                is_rest: z.coerce.boolean(),
                is_limited: z.coerce.boolean(),
                version: z.string(),
                fc2_channel: z.object({
                    result: z.number(),
                    userid: z.number(),
                    fc2id: z.number(),
                    adult: z.coerce.boolean(),
                    title: z.string(),
                    description: z.string(),
                    url: z.string(),
                    images: z.array(z.string()),
                }),
                control_tag: z.string(),
                publish_method: z.string(),

                // depending on whether a channel is marked as adult or not, these can be different types
                video_stereo3d: z.union([z.string().regex(/\d+/), z.number()]),
                video_mapping: z.union([z.string().regex(/\d+/), z.number()]),
                video_horizontal_view: z.union([
                    z.string().regex(/\d+/),
                    z.number(),
                ]),
                total: z.number(),
            })
            .strip(),
        profile_data: z
            .object({
                userid: z.coerce.string(),
                fc2id: z.coerce.string(),
                name: z.string(),
                info: z.string(),
                age: z.coerce.number(),
                sex: z.string(),
                icon: z.string(),
                image: z.string(),
            })
            .strip(),
    })
    .strip();

export const MEMBER_RESPONSE_OK_SCHEMA = z.object({
    status: z.number().min(1).max(1),
    data: MEMBER_SCHEMA,
});

export const MEMBER_RESPONSE_ERROR_SCHEMA = z.object({
    status: z.number(),
    msg: z.string(),
});

export const MEMBER_RESPONSE_SCHEMA = z.union([
    MEMBER_RESPONSE_OK_SCHEMA.strip(),
    MEMBER_RESPONSE_ERROR_SCHEMA.strip(),
]);
