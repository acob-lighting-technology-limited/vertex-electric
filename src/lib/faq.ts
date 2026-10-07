/**
 * FAQ content. Answers avoid commitments Vertex hasn't confirmed (duty rates,
 * warranty length, delivery times) — those are given per car in the quote.
 */
export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "buying",
    title: "Buying",
    items: [
      {
        q: "Why don't you show prices online?",
        a: "An imported car's price depends on its specification, the exchange rate and shipping costs at the time you buy. Instead of a figure that may be out of date, we send you the current price for the exact car when you request it.",
      },
      {
        q: "Are the photos of the actual car?",
        a: "Yes. Every listing shows the exact car you'd receive — never stock images. If photos were taken before shipping, the listing says so. Number plates are blurred for privacy.",
      },
      {
        q: "Can I see the car before I pay?",
        a: "Cars marked 'In showroom' can be viewed and test-driven by appointment. For cars that are arriving or ordered on request, we share photos, videos and inspection details before you commit.",
      },
      {
        q: "Can you get a car that isn't listed?",
        a: "Yes — that's our order-on-request service. Tell us the model, spec, colour and budget and we'll come back with options and a quote.",
      },
    ],
  },
  {
    id: "import",
    title: "Import & delivery",
    items: [
      {
        q: "Where do your cars come from?",
        a: "Mainly China, which builds many of the world's leading EVs, and other markets where the right car is available. Every car is inspected before it ships.",
      },
      {
        q: "Who handles shipping and customs?",
        a: "We do. We arrange shipping to Lagos and handle port clearance, then hand the car over at our showroom or arrange delivery.",
      },
      {
        q: "How long does an order take?",
        a: "It depends on the car and the shipping schedule at the time. Your quote includes an estimated timeline, and we keep you updated along the way.",
      },
      {
        q: "Is import duty included in the price?",
        a: "Your quote sets out exactly what is included, so there are no surprises at the port.",
      },
    ],
  },
  {
    id: "charging",
    title: "Charging & range",
    items: [
      {
        q: "How far can I drive on a charge?",
        a: "It depends on the car and how you drive. Many EVs quote range on China's CLTC test, which is optimistic; real-world range is lower. Our range planner gives a realistic estimate for your driving.",
      },
      {
        q: "What about power outages?",
        a: "Pair your home charger with solar panels and battery storage from our sister company, ACOB Lighting, so you can charge whether or not the grid is up.",
      },
      {
        q: "Are there public chargers in Nigeria?",
        a: "Still only a few. Most EV owners charge at home overnight. Our sister company, Vertex EV Hub, is building a public charging network.",
      },
      {
        q: "Will any charger fit my car?",
        a: "No — cars built for the Chinese market usually use the GB/T standard, while many others use CCS2 or Type 2. We confirm your car's charge port and recommend a compatible charger.",
      },
    ],
  },
  {
    id: "ownership",
    title: "Ownership",
    items: [
      {
        q: "Is an EV expensive to maintain?",
        a: "Generally less than a petrol car: there's no engine oil, spark plugs, timing belt or gearbox servicing. Tyres, brakes, suspension and cabin filters still need normal care.",
      },
      {
        q: "How long do EV batteries last?",
        a: "Modern EV batteries are designed to last many years. Where we have a battery health report for a car, we show the figure on its listing.",
      },
      {
        q: "What warranty and after-sales support do I get?",
        a: "Warranty and service terms depend on the vehicle and are set out in your quote and sales agreement. Our Nigerian team supports you after the sale.",
      },
      {
        q: "Can I drive an EV through flooded roads?",
        a: "EV batteries are sealed, but no car should be driven through deep flood water. Treat flooding exactly as you would in a petrol car — if in doubt, wait it out.",
      },
    ],
  },
];
