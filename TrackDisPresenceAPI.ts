const URL = "https://supertiger.nerimity.com/trackdispresence";

interface FormattedPresence {
  status: string;
  activities: FormattedActivity[];
}
interface FormattedActivity {
  name: string;
  createdTimestamp: number | null;
  details: string | null;
  state: string | null;
  syncId: string | null;
  url?: string | null;
  assets?: {
    largeText?: string | null;
    smallText?: string | null;
    largeImage?: string | null;
    smallImage?: string | null;
  };
  timestamps?: {
    start: Date | null;
    end: Date | null;
  } | null;
}

export const createPresenceTracker = (userId: string) => {
  const events = {
    presenceUpdate: (data: FormattedPresence) => {},
  };
  const ws = new WebSocket(URL + `/${userId}`);
  ws.onopen = () => {
    console.log("Connected to TrackDisPresence");
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data as string);
    if (data.error) {
      console.error(data.error);
      return;
    }
    events.presenceUpdate(data);
  };

  return { events };
};
