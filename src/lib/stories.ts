/**
 * "Made for Lagos" story frames. Photos are from Unsplash under the Unsplash
 * License (free for commercial use). Credits are shown on each frame anyway.
 * Locations are as listed by the photographer on Unsplash.
 */
export type StoryFrame = {
  slug: string;
  src: { lg: string; sm: string };
  width: number;
  height: number;
  alt: string;
  place: string;
  title: string;
  body: string;
  credit: { name: string; url: string };
};

export const storyFrames: StoryFrame[] = [
  {
    slug: "vi-dusk",
    src: { lg: "/media/stories/vi-dusk-1600.webp", sm: "/media/stories/vi-dusk-800.webp" },
    width: 2400,
    height: 1167,
    alt: "Ahmadu Bello Way, Victoria Island, at dusk with towers on the skyline",
    place: "Victoria Island, Lagos",
    title: "Glide home in silence.",
    body: "No engine noise, no fumes — just the city at dusk.",
    credit: { name: "Chuks Ugwuh", url: "https://unsplash.com/photos/road-and-buildings-G0OqiEiHP1Y" },
  },
  {
    slug: "lagos-traffic",
    src: { lg: "/media/stories/lagos-traffic-1600.webp", sm: "/media/stories/lagos-traffic-800.webp" },
    width: 2400,
    height: 3600,
    alt: "Aerial view of busy Lagos traffic at dusk with a bridge behind",
    place: "Lagos",
    title: "Go-slow costs less.",
    body: "An EV uses barely any energy standing still. No idling, no fuel burning in traffic.",
    credit: { name: "Ben Iwara", url: "https://unsplash.com/photos/a-view-of-a-busy-city-street-with-a-bridge-in-the-background-Lpk_o-XeRWo" },
  },
  {
    slug: "charge-port",
    src: { lg: "/media/stories/charge-port-1600.webp", sm: "/media/stories/charge-port-800.webp" },
    width: 2400,
    height: 1597,
    alt: "A charging cable plugged into an electric car's charge port, lit blue",
    place: "At home",
    title: "Your driveway is the fuel station.",
    body: "Plug in overnight, wake up full. Add solar from ACOB Lighting and charge through outages.",
    credit: { name: "CHUTTERSNAP", url: "https://unsplash.com/photos/electric-vehicle-charging-cable-plugged-into-car-xJLsHl0hIik" },
  },
  {
    slug: "oniru-twilight",
    src: { lg: "/media/stories/oniru-twilight-1600.webp", sm: "/media/stories/oniru-twilight-800.webp" },
    width: 2400,
    height: 1800,
    alt: "Oniru Beach at twilight with the Lagos skyline across the water",
    place: "Oniru Beach, Lagos",
    title: "Weekends without the petrol queue.",
    body: "Beach runs, family trips, late drives home — on electricity.",
    credit: { name: "Peace Itimi", url: "https://unsplash.com/photos/sea-near-the-city-during-daytime-gOdPARdRUtQ" },
  },
  {
    slug: "lagos-island",
    src: { lg: "/media/stories/lagos-island-1600.webp", sm: "/media/stories/lagos-island-800.webp" },
    width: 2400,
    height: 3600,
    alt: "Lagos Island towers and streets seen from above",
    place: "Lagos Island",
    title: "Sourced worldwide. Supported here.",
    body: "Every Vertex car is inspected, delivered and backed by a team in Nigeria.",
    credit: { name: "Fahd Aminu", url: "https://unsplash.com/photos/cityscape-with-tall-buildings-crowded-streets-and-a-river-i4No07Qvhl4" },
  },
];
