"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMBER_RESPONSE_SCHEMA = exports.MEMBER_RESPONSE_ERROR_SCHEMA = exports.MEMBER_RESPONSE_OK_SCHEMA = exports.MEMBER_SCHEMA = exports.CHANNEL_LIST_SCHEMA = exports.CHANNEL_SCHEMA = void 0;
const zod_1 = require("zod");
exports.CHANNEL_SCHEMA = zod_1.z
    .object({
    id: zod_1.z.string(),
    bid: zod_1.z.string(),
    fc2id: zod_1.z.number(),
    title: zod_1.z.string(),
    name: zod_1.z.string(),
    image: zod_1.z.string(),
    type: zod_1.z.number().min(0).max(2),
    category: zod_1.z.number(),
    sex: zod_1.z.string(),
    lang: zod_1.z.string(),
    count: zod_1.z.number(),
    total: zod_1.z.number(),
    login: zod_1.z.number().min(0).max(2),
    video: zod_1.z.coerce.boolean(),
    app: zod_1.z.coerce.boolean(),
    pay: zod_1.z.coerce.boolean(),
    amount: zod_1.z.number(),
    interval: zod_1.z.number(),
    start_time: zod_1.z.number(),
    start: zod_1.z.string().regex(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/),
    comment_l: zod_1.z.number(),
    price: zod_1.z.number(),
    official: zod_1.z.number(),
    comment_score: zod_1.z.number(),
    deny_country_flg: zod_1.z.string(),
    panorama: zod_1.z.number(),
    tid: zod_1.z.number(),
})
    .strict();
exports.CHANNEL_LIST_SCHEMA = zod_1.z
    .object({
    channel: zod_1.z.array(exports.CHANNEL_SCHEMA),
    is_adult: zod_1.z.number(),
    link: zod_1.z.string().url(),
    time: zod_1.z.number(),
})
    .strict();
exports.MEMBER_SCHEMA = zod_1.z
    .object({
    channel_data: zod_1.z
        .object({
        channelid: zod_1.z.coerce.string(),
        userid: zod_1.z.coerce.string(),
        title: zod_1.z.string(),
        info: zod_1.z.string(),
        category: zod_1.z.coerce.string(),
        category_name: zod_1.z.string(),
        adult: zod_1.z.coerce.boolean(),
        twoshot: zod_1.z.coerce.boolean(),
        login_only: zod_1.z.number().min(0).max(2),
        is_publish: zod_1.z.coerce.boolean(),
        count: zod_1.z.number(),
        image: zod_1.z.string(),
        is_app: zod_1.z.coerce.boolean(),
        fee: zod_1.z.coerce.boolean(),
        amount: zod_1.z.number(),
        interval: zod_1.z.number(),
        start: zod_1.z.number(),
        gift_limit: zod_1.z.number(),
        gift_list: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.number(),
            type: zod_1.z.number(),
            url: zod_1.z.array(zod_1.z.string()),
            name: zod_1.z.string(),
        })),
        comment_limit: zod_1.z.string(),
        tfollow: zod_1.z.number(),
        tname: zod_1.z.string(),
        is_official: zod_1.z.coerce.boolean(),
        is_premium_publisher: zod_1.z.coerce.boolean(),
        is_link_share: zod_1.z.coerce.boolean(),
        ticketid: zod_1.z.number(),
        is_premium: zod_1.z.coerce.boolean(),
        ticket_price: zod_1.z.number(),
        ticket_only: zod_1.z.coerce.boolean(),
        is_video: zod_1.z.coerce.boolean(),
        is_rest: zod_1.z.coerce.boolean(),
        is_limited: zod_1.z.coerce.boolean(),
        version: zod_1.z.string(),
        fc2_channel: zod_1.z.object({
            result: zod_1.z.number(),
            userid: zod_1.z.number(),
            fc2id: zod_1.z.number(),
            adult: zod_1.z.coerce.boolean(),
            title: zod_1.z.string(),
            description: zod_1.z.string(),
            url: zod_1.z.string(),
            images: zod_1.z.array(zod_1.z.string()),
        }),
        control_tag: zod_1.z.string(),
        publish_method: zod_1.z.string(),
        // depending on whether a channel is marked as adult or not, these can be different types
        video_stereo3d: zod_1.z.union([zod_1.z.string().regex(/\d+/), zod_1.z.number()]),
        video_mapping: zod_1.z.union([zod_1.z.string().regex(/\d+/), zod_1.z.number()]),
        video_horizontal_view: zod_1.z.union([
            zod_1.z.string().regex(/\d+/),
            zod_1.z.number(),
        ]),
    })
        .strict(),
    profile_data: zod_1.z
        .object({
        userid: zod_1.z.coerce.string(),
        fc2id: zod_1.z.coerce.string(),
        name: zod_1.z.string(),
        info: zod_1.z.string(),
        age: zod_1.z.coerce.number(),
        sex: zod_1.z.string(),
        icon: zod_1.z.string(),
        image: zod_1.z.string(),
    })
        .strict(),
})
    .strict();
exports.MEMBER_RESPONSE_OK_SCHEMA = zod_1.z.object({
    status: zod_1.z.number().min(1).max(1),
    data: exports.MEMBER_SCHEMA,
});
exports.MEMBER_RESPONSE_ERROR_SCHEMA = zod_1.z.object({
    status: zod_1.z.number(),
    msg: zod_1.z.string(),
});
exports.MEMBER_RESPONSE_SCHEMA = zod_1.z.union([
    exports.MEMBER_RESPONSE_OK_SCHEMA,
    exports.MEMBER_RESPONSE_ERROR_SCHEMA,
]);
