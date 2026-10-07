/**
 * Launch inventory, used until the Sanity project exists. Only facts we can
 * verify from the photos are filled in; anything unconfirmed is left empty
 * rather than guessed (specs, year, trim). Prices are never stored here.
 */
import vx1 from "../../../public/inventory/vx-0001/manifest.json";
import vx2 from "../../../public/inventory/vx-0002/manifest.json";
import vx3 from "../../../public/inventory/vx-0003/manifest.json";
import type { CarModel, PhotoSection, PublicVehicle, VehiclePhoto } from "./types";

type Manifest = { file: string; width: number; height: number }[];

/** Pick photos from a processed manifest in display order, with alt text and section. */
function photos(stock: string, manifest: Manifest, order: [file: string, section: PhotoSection, alt: string][]): VehiclePhoto[] {
  return order.map(([file, section, alt]) => {
    const m = manifest.find((x) => x.file === file);
    if (!m) throw new Error(`${stock}: ${file} missing from manifest`);
    return { src: `/inventory/${stock.toLowerCase()}/${file}`, width: m.width, height: m.height, alt, section };
  });
}

export const models: CarModel[] = [
  {
    slug: "xiaomi-su7",
    make: "Xiaomi",
    model: "SU7",
    bodyType: "sedan",
    powertrain: "bev",
    confirmed: true,
    availableToOrder: true,
    tagline: "Electric performance sedan",
    summary:
      "Xiaomi's fastback electric sedan: a low, wide stance, a minimalist cabin built around a large central display, and fast charging.",
    // Specs vary by trim (Standard / Pro / Max). Filled in once the trim is confirmed.
    specs: {},
  },
  {
    slug: "vx-0002-suv",
    make: "",
    model: "",
    bodyType: "suv",
    confirmed: false, // Sill plates read 方程豹 (Fangchengbao, BYD). Model and powertrain to confirm.
    availableToOrder: false,
    specs: {},
  },
  {
    slug: "vx-0003-sedan",
    make: "",
    model: "",
    bodyType: "sedan",
    confirmed: false, // Model to confirm.
    availableToOrder: false,
    specs: {},
  },
];

const model = (slug: string) => {
  const m = models.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown model ${slug}`);
  return m;
};

export const vehicles: PublicVehicle[] = [
  {
    stockNumber: "VX-0001",
    slug: "vx-0001",
    model: model("xiaomi-su7"),
    exteriorColour: "Grey",
    interiorColour: "Cream",
    mileageKm: 10792, // Lifetime odometer on the car's trip screen (photo 08).
    availability: "arriving",
    featured: true,
    highlights: ["Cream leather interior", "Large central touchscreen", "Ambient cabin lighting"],
    photoNote: "Pre-shipment photos, China. Number plates obscured.",
    photos: photos("VX-0001", vx1, [
      ["06.webp", "exterior", "Grey Xiaomi SU7, front three-quarter view"],
      ["02.webp", "exterior", "Grey Xiaomi SU7, front three-quarter view from the right"],
      ["10.webp", "exterior", "Grey Xiaomi SU7, front view"],
      ["04.webp", "exterior", "Grey Xiaomi SU7, rear view"],
      ["09.webp", "interior", "Driver's seat and dashboard through the open front door"],
      ["01.webp", "interior", "Rear seats through the open rear door"],
      ["03.webp", "interior", "Cream leather seat detail"],
      ["05.webp", "interior", "Cabin view from the rear seats towards the dashboard"],
      ["07.webp", "tech", "Steering wheel and central touchscreen"],
      ["08.webp", "tech", "Trip and energy screen showing lifetime mileage"],
    ]),
  },
  {
    stockNumber: "VX-0002",
    slug: "vx-0002",
    model: model("vx-0002-suv"),
    exteriorColour: "Black",
    interiorColour: "Tan",
    availability: "arriving",
    featured: true,
    highlights: ["Tan quilted leather", "Rear-mounted spare wheel", "Tow hitch fitted"],
    photoNote: "Pre-shipment photos, China. Number plates obscured.",
    photos: photos("VX-0002", vx2, [
      ["03.webp", "exterior", "Black SUV, front three-quarter view"],
      ["01.webp", "exterior", "Black SUV, front three-quarter view from low angle"],
      ["04.webp", "exterior", "Black SUV, rear three-quarter view with spare wheel"],
      ["08.webp", "exterior", "Black SUV, rear three-quarter view from the right"],
      ["02.webp", "interior", "Front seats through the open driver's door"],
      ["05.webp", "interior", "Front cabin and dashboard from the passenger side"],
      ["06.webp", "interior", "Rear seats with quilted tan leather"],
      ["07.webp", "interior", "Second row through the open rear door"],
      ["09.webp", "interior", "Second-row seat and door trim"],
    ]),
  },
  {
    stockNumber: "VX-0003",
    slug: "vx-0003",
    model: model("vx-0003-sedan"),
    exteriorColour: "Black",
    interiorColour: "Cream and grey",
    availability: "arriving",
    featured: true,
    highlights: ["Cream leather interior", "Wide-screen dashboard"],
    photoNote: "Pre-shipment photos, China.",
    photos: photos("VX-0003", vx3, [
      ["03.webp", "exterior", "Black electric sedan, front view"],
      ["02.webp", "interior", "Dashboard and front seats"],
      ["01.webp", "interior", "Driver's seat through the open door"],
      ["04.webp", "interior", "Rear seats through the open rear door"],
    ]),
  },
];
