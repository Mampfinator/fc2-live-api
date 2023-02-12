# FC2 Live API

[FC2 Live](https://live.fc2.com) is a somewhat popular Japanese streaming platform, especially popular among AVTubers (VTubers with a focus on adult content).

Surprisingly, they have an API! Documentation is lacklustre and it's not self-consistent, but it does exist.

This wrapper aims to be more self-consistent & provide a slightly better developer experience than just raw queries.

## Usage

If you only want to fetch a handful of users, you can do that manually:

```ts
const { FC2Client } = require("fc2-live-api");

const client = new FC2Client();

client.channels.fetchMember(CHANNEL_ID_HERE, {channel: true})
    .then(console.log);
```

If you need to check more users (and you can live with up to 30 seconds delay between a channel changing state and the event being emitted), it's recommended you use the event generator instead:

```ts
(async () => {
    await client.channels.start(); // starts the event generator

    client.on("channel:live", async (member) => {
        if (!TRACKED_MEMBERS.has(member.channelId)) return;

        // do what you need to do here
    });

    client.on("channel:offline", async (member) => {
        if (!TRACKED_MEMBERS.has(member.channelId)) return;

        // do what you need to do here
    });
})();
```

It uses EventEmitter3 under the hood so all events are fully typed. All `channel:` events are also emitted without the prefix on `FC2Client#channels`.

Support for comments may be added soon.

Support for undocumented API fields is in the works (needs experimentation).
