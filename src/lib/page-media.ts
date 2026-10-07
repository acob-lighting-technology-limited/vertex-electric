/** Page imagery from Unsplash (Unsplash License — free for commercial use). Also listed in CREDITS.md. */
export type PageImage = {
  lg: string;
  sm: string;
  width: number;
  height: number;
  alt: string;
  credit: { name: string; url: string };
};

const img = (name: string, width: number, height: number, alt: string, credit: string, url: string): PageImage => ({
  lg: `/media/pages/${name}-1920.webp`,
  sm: `/media/pages/${name}-960.webp`,
  width,
  height,
  alt,
  credit: { name: credit, url },
});

export const pageImages = {
  abujaGate: img(
    "abuja-gate",
    1920,
    2560,
    "Abuja City Gate on the expressway under a stormy sky, Nigerian flag flying",
    "Chizon",
    "https://unsplash.com/photos/a-car-driving-down-a-highway-under-a-cloudy-sky-UwoCLYgejB0",
  ),
  abujaTowers: img(
    "abuja-towers",
    1920,
    2401,
    "Abuja skyline with high-rise towers above the trees",
    "Chizon",
    "https://unsplash.com/photos/a-city-street-with-tall-buildings-in-the-background-LfRn3yxsrQo",
  ),
  abujaSunset: img(
    "abuja-sunset",
    1920,
    1280,
    "Sun setting over the Abuja City Gate in silhouette",
    "Baqeer Gashua",
    "https://unsplash.com/photos/the-sun-is-setting-over-the-horizon-of-a-city-pS7D8lroxTM",
  ),
  homeCharger: img(
    "home-charger",
    1920,
    1280,
    "A hand plugging a charging cable into a wall-mounted home EV charger",
    "Zaptec",
    "https://unsplash.com/photos/a-person-is-plugging-in-to-a-wall-mounted-device-9QzxkWxMUik",
  ),
  solarDusk: img(
    "solar-dusk",
    1920,
    1280,
    "Homes with rooftop solar panels at dusk",
    "Vivint Solar",
    "https://unsplash.com/photos/a-house-with-a-solar-panel-on-the-roof-_ciUqT1HEuY",
  ),
} as const;
