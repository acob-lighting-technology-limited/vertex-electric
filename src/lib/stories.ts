/**
 * "Made for the way Nigeria moves" story frames — Abuja first (home of ACOB Group),
 * then Lagos. Photos are from Unsplash under the Unsplash License (free for commercial
 * use; attribution not required). Credits are kept in CREDITS.md.
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

const frame = (slug: string, width: number, height: number, rest: Omit<StoryFrame, "slug" | "src" | "width" | "height">): StoryFrame => ({
  slug,
  src: { lg: `/media/stories/${slug}-1600.webp`, sm: `/media/stories/${slug}-800.webp` },
  width,
  height,
  ...rest,
});

export const storyFrames: StoryFrame[] = [
  frame("abuja-night", 2400, 3600, {
    alt: "Cars on an Abuja road at night under tall streetlights",
    place: "Abuja",
    title: "Glide home in silence.",
    body: "No engine noise, no fumes — just the city lights on the drive home.",
    credit: { name: "Habila Mazawaje", url: "https://unsplash.com/photos/qQMpHZ33vRI" },
  }),
  frame("abuja-avenue", 2400, 1597, {
    alt: "A wide tree-lined Abuja road at golden hour",
    place: "Abuja",
    title: "Wide roads, cheaper miles.",
    body: "Your daily commute costs a fraction of petrol when you run on electricity.",
    credit: { name: "Macdavis Johnson", url: "https://unsplash.com/photos/a-car-driving-down-a-street-next-to-trees-hzx5kpvmgco" },
  }),
  frame("charge-port", 2400, 1597, {
    alt: "A charging cable plugged into an electric car's charge port, lit blue",
    place: "At home",
    title: "Your driveway is the fuel station.",
    body: "Plug in overnight, wake up full. Add solar from ACOB Lighting and charge through outages.",
    credit: { name: "CHUTTERSNAP", url: "https://unsplash.com/photos/electric-vehicle-charging-cable-plugged-into-car-xJLsHl0hIik" },
  }),
  frame("lagos-traffic", 2400, 3600, {
    alt: "Aerial view of busy Lagos traffic at dusk with a bridge behind",
    place: "Lagos",
    title: "Go-slow costs less.",
    body: "An EV uses barely any energy standing still. No idling, no fuel burning in traffic.",
    credit: { name: "Ben Iwara", url: "https://unsplash.com/photos/a-view-of-a-busy-city-street-with-a-bridge-in-the-background-Lpk_o-XeRWo" },
  }),
  frame("oniru-twilight", 2400, 1800, {
    alt: "Oniru Beach at twilight with the Lagos skyline across the water",
    place: "Oniru Beach, Lagos",
    title: "Weekends without the petrol queue.",
    body: "Beach runs, family trips, late drives home — on electricity.",
    credit: { name: "Peace Itimi", url: "https://unsplash.com/photos/sea-near-the-city-during-daytime-gOdPARdRUtQ" },
  }),
  frame("abuja-rocks", 2400, 1600, {
    alt: "The moon rising behind Abuja's granite rocks at dusk",
    place: "Abuja",
    title: "Sourced worldwide. Supported at home.",
    body: "Every Vertex car is inspected, delivered and backed by our team in Nigeria.",
    credit: { name: "Ben Iwara", url: "https://unsplash.com/photos/2EPVb4L_GEI" },
  }),
];
