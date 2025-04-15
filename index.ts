import { RPCClient } from "@nerimity/nerimity.js";
import { createPresenceTracker, type FormattedActivity } from "./TrackDisPresenceAPI";

const client = new RPCClient();

let tracker: ReturnType<typeof createPresenceTracker> | null = null;

const ActivityType = {
  PLAYING: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
  COMPETING: 5,
}
const ActivityTypeToNameAndAction = (activity: FormattedActivity) => {
  switch (activity.type) {
    case ActivityType.PLAYING:
      return { name: activity.name || "Unknown", action: "Playing" };
    case ActivityType.STREAMING:
      return { name: activity.name || "Unknown", action: "Streaming" };
    case ActivityType.LISTENING:
      return { name: activity.name || "Unknown", action: "Listening to" };
    case ActivityType.WATCHING:
      return { name: activity.name || "Unknown", action: "Watching" };
    case ActivityType.CUSTOM:
      return { name: activity.state || "Unknown", action: "Custom" };
    case ActivityType.COMPETING:
      return { name: activity.name || "Unknown", action: "Competing in" };
    default:
      return { name: activity.name || "Unknown", action: "Playing" };
  }
}
client.on("ready", () => {
  console.log("Connected to Nerimity Client.");
  if (!tracker) {
    tracker = createPresenceTracker(process.env.USER_ID!);
  }

  tracker.events.presenceUpdate = (data) => {
    const activity = data.activities[0];
    if (!activity) {
      client.send(null);
      return;
    }

    let url = undefined;

    const isSpotify = !!activity.assets?.largeImage?.startsWith("spotify:");

 
    if (isSpotify && activity.syncId) {
      url = `https://open.spotify.com/track/${activity.syncId}`
    }

    console.log(activity.assets)
    client.send({
      startedAt: activity.timestamps?.start || undefined,
      endsAt: activity.timestamps?.end || undefined,
      imgSrc: activity.assets?.largeImageUrl || activity.assets?.smallImageUrl || undefined,
      title: activity.details || undefined,
      subtitle: activity.state || undefined,
      link: url || activity.url,
      ...ActivityTypeToNameAndAction(activity),
    })
  };
});

client.login("1630300334100500480");
