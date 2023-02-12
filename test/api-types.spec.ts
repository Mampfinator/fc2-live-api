import { join } from "path";
import { request } from "undici";
import { z } from "zod";
import { BASE_URL } from "../src/util";
import { CHANNEL_LIST_SCHEMA, MEMBER_SCHEMA } from "../src/schemas";

// This test suite is used to track and detect API changes.
// Because, as stated in the API docs, "Please understand that FC2 may change the API at any time without warning."

describe("Validate API types", () => {
    it("/contents/allchannellist.php", async () => {
        await request(BASE_URL + join("contents", "allchannellist.php"))
            .then((res) => res.body.json())
            .then((body) => CHANNEL_LIST_SCHEMA.parse(body));
    });

    it("/adult/contents/allchannellist.php", async () => {
        await request(
            BASE_URL + join("adult", "contents", "allchannellist.php")
        )
            .then((res) => res.body.json())
            .then((body) => CHANNEL_LIST_SCHEMA.parse(body));
    });

    it("/api/memberApi.php", async () => {
        const TBF_ID = "31443095"; // random-ass soccer channel, apparently

        const responseSchema = z
            .object({
                status: z.number(),
                data: MEMBER_SCHEMA,
            })
            .strict();

        await request(BASE_URL + join("api", `memberApi.php`), {
            query: { channel: 1, profile: 1, streamid: TBF_ID },
        })
            .then((res) => res.body.json())
            .then((body) => responseSchema.parse(body));
    });

    it("/api/memberApi.php (adult channel)", async () => {
        const CONNECTOPIA_ID = "49286435"; // Connectopia channel ID

        const responseSchema = z
            .object({
                status: z.number(),
                data: MEMBER_SCHEMA,
            })
            .strict();

        await request(BASE_URL + join("api", `memberApi.php`), {
            query: { channel: 1, profile: 1, streamid: CONNECTOPIA_ID },
        })
            .then((res) => res.body.json())
            .then((body) => responseSchema.parse(body));
    });
});
