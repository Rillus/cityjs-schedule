interface Location {
  events: any;
  id: number;
  name: string;
  events?: EventType[];
}

interface ActType {
  id?: number;
  name: string;
  url?: string;
  description?: string;
  speakerBio?: string;
  company?: string;
  bluesky?: string;
  short: string;
  image?: string;
  spotify?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  soundcloud?: string;
  website?: string;
  stage?: number;
  events?: EventType[];
}

interface Data {
  modified?: string;
  locations: Location[];
}

interface EventType extends ActType {
  url?: string;
  start: string;
  end: string;
  events?: EventType[];
  location?: Location;
}

export {ActType, ActsProps, Data, Location, EventType};
