import { join } from "path";
import { request } from "undici";
import {z} from "zod";
import { BASE_URL } from "../src/util";

// This test suite is used to track and detect API changes.
// Because, as stated in the API docs, "Please understand that FC2 may change the API at any time without warning."

describe("Validate API types", () => {
    const bNumber = z.number().min(0).max(1);

    const CHANNEL_LIST_SCHEMA = z.object({
        channel: z.array(z.object({
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
            video: bNumber,
            app: bNumber,
            pay: bNumber,
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
        }).strict()),
        is_adult: z.number(),
        link: z.string().url(),
        time: z.number(),
    }).strict();

    const MEMBER_SCHEMA = z.object({
        channel_data: z.object({
            channelid: z.string(),
            userid: z.string(),
            title: z.string(),
            info: z.string(),
            category: z.string(),
            category_name: z.string(),
            adult: bNumber,
            twoshot: bNumber,
            login_only: z.number().min(0).max(2),
            is_publish: bNumber,
            count: z.number(),
            image: z.string(),
            is_app: bNumber,
            fee: bNumber,
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
            is_official: bNumber,
            is_premium_publisher: bNumber,
            is_link_share: bNumber,
            ticketid: z.number(),
            is_premium: bNumber,
            ticket_price: z.number(),
            ticket_only: bNumber,
            is_video: bNumber,
            is_rest: bNumber,
            is_limited: bNumber,
            version: z.string(),
            fc2_channel: z.object({
                result: z.number(),
                userid: z.number(),
                fc2id: z.number(),
                adult: bNumber,
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

    it("/contents/allchannellist.php", async () => {
        await request(BASE_URL + join("contents", "allchannellist.php"))
            .then(res => res.body.json())
            .then(body => CHANNEL_LIST_SCHEMA.parse(body));


    });

    it ("/adult/contents/allchannellist.php", async () => {
        await request(BASE_URL + join("adult", "contents", "allchannellist.php"))
            .then(res => res.body.json())
            .then(body => CHANNEL_LIST_SCHEMA.parse(body));
    });


    it("/api/memberApi.php", async () => {
        const TBF_ID = "31443095"; // random-ass soccer channel, apparently

        const responseSchema = z.object({
            status: z.number(),
            data: MEMBER_SCHEMA,
        }).strict();

        await request(BASE_URL + join("api", `memberApi.php`), {query: { channel: 1, profile: 1, streamid: TBF_ID }})
            .then(res => res.body.json())
            .then(body => responseSchema.parse(body));
    });

    it("/api/memberApi.php (adult channel)", async () => {
        const CONNECTOPIA_ID = "49286435"; // Connectopia channel ID

        const responseSchema = z.object({
            status: z.number(),
            data: MEMBER_SCHEMA,
        }).strict();

        await request(BASE_URL + join("api", `memberApi.php`), {query: { channel: 1, profile: 1, streamid: CONNECTOPIA_ID }})
            .then(res => res.body.json())
            .then(body => responseSchema.parse(body));
    })
});