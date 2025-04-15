const URL = "https://supertiger.nerimity.com/trackdispresence";

interface FormattedPresence {
  status: string;
  activities: FormattedActivity[];
}
export interface FormattedActivity {
  name: string;
  createdTimestamp: number | null;
  details: string | null;
  state: string | null;
  syncId: string | null;
  url?: string | null;
  type: number;
  assets?: {
    largeText?: string | null;
    smallText?: string | null;
    largeImageUrl: string | null;
    smallImageUrl: string | null;
    largeImage?: string | null;
    smallImage?: string | null;
  };
  timestamps?: {
    start: number | null;
    end: number | null;
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
