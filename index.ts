import { RPCClient } from "@nerimity/nerimity.js";
import { createPresenceTracker } from "./TrackDisPresenceAPI";

const client = new RPCClient();

const tracker = createPresenceTracker(process.env.USER_ID!);

client.on("ready", () => {
  console.log("Connected to Nerimity Client.");

  tracker.events.presenceUpdate = (data) => {
    if (!data) {
      client.send(null);
      return;
    }
  };
});

client.login("1630300334100500480");
