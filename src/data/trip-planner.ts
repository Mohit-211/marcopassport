import type {
  Budget,
  CategoryId,
  GroupType,
  Interest,
  PlannerItem,
} from "@/types/trip";

export const PLANNER_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "events", label: "Events" },
  { id: "live-music", label: "Live Music" },
  { id: "top-picks", label: "Top Picks" },
  { id: "dining", label: "Dining" },
  { id: "lodging", label: "Lodging" },
  { id: "to-do", label: "To Do" },
  { id: "shopping", label: "Shopping" },
  { id: "local-services", label: "Local Services" },
  { id: "info", label: "Info" },
];

export const INTERESTS: { id: Interest; label: string }[] = [
  { id: "beaches", label: "Beaches" },
  { id: "dining", label: "Dining" },
  { id: "live-music", label: "Live Music" },
  { id: "golf", label: "Golf" },
  { id: "boating-fishing", label: "Boating & Fishing" },
  { id: "shopping", label: "Shopping" },
  { id: "family-fun", label: "Family Fun" },
  { id: "arts-culture", label: "Arts & Culture" },
  { id: "nightlife", label: "Nightlife" },
  { id: "nature-wildlife", label: "Nature & Wildlife" },
  { id: "wellness", label: "Wellness" },
];

export const GROUP_TYPES: { id: GroupType; label: string }[] = [
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends" },
];

export const BUDGETS: { id: Budget; label: string; hint: string }[] = [
  { id: "low", label: "Low", hint: "Free beaches, casual bites, budget stays" },
  { id: "medium", label: "Medium", hint: "A mix of splurges and easy-going days" },
  { id: "high", label: "High", hint: "Resorts, charters and fine dining" },
];

/** Used by the destination autocomplete until Google Places is wired in. */
export const DESTINATION_SUGGESTIONS = [
  "Marco Island, FL",
  "Naples, FL",
  "Isles of Capri, FL",
  "Goodland, FL",
  "Everglades City, FL",
  "Chokoloskee, FL",
  "Bonita Springs, FL",
  "Fort Myers, FL",
  "Fort Myers Beach, FL",
  "Sanibel Island, FL",
  "Key West, FL",
  "Miami, FL",
];

export const DEFAULT_DESTINATION = "Marco Island, FL";

export const MARCO_ISLAND_CENTER = { lat: 25.9412, lng: -81.7184 };

/**
 * Sample data for the prototype. Public places (beaches, parks, museum) use
 * their real locations; businesses and events are illustrative.
 */
export const PLANNER_ITEMS: PlannerItem[] = [
  {
    id: "tigertail-beach",
    name: "Tigertail Beach",
    category: "to-do",
    topPick: true,
    interests: ["beaches", "nature-wildlife", "family-fun"],
    time: "09:00",
    hours: "Daily · 7am–sunset",
    address: "490 Hernando Dr, Marco Island, FL 34145",
    lat: 25.9496,
    lng: -81.7436,
    priceLevel: 1,
    description:
      "Wade across the lagoon to Sand Dollar Island for shelling and birdwatching on a wide, quiet beach.",
    image: "/assets/place-tigertail.jpg",
  },
  {
    id: "historical-museum",
    name: "Marco Island Historical Museum",
    category: "to-do",
    interests: ["arts-culture", "family-fun"],
    time: "10:30",
    hours: "Tue–Sat · 9am–4pm",
    address: "180 S Heathwood Dr, Marco Island, FL 34145",
    lat: 25.9437,
    lng: -81.7149,
    priceLevel: 0,
    description:
      "Calusa artifacts, pioneer history and the story of the island's famous Key Marco Cat.",
    image: "/assets/place-museum.jpg",
  },
  {
    id: "dolphin-cruise",
    name: "Ten Thousand Islands Dolphin Cruise",
    category: "to-do",
    topPick: true,
    interests: ["boating-fishing", "nature-wildlife", "family-fun"],
    time: "13:00",
    hours: "Daily · 10am, 1pm & 4pm",
    address: "Bald Eagle Dr, Marco Island, FL 34145",
    lat: 25.9598,
    lng: -81.7128,
    priceLevel: 3,
    description:
      "A two-hour narrated cruise through mangrove islands with frequent dolphin and manatee sightings.",
    image: "/assets/place-cruise.jpg",
  },
  {
    id: "island-links",
    name: "Island Links Golf Practice Center",
    category: "to-do",
    interests: ["golf", "wellness"],
    time: "08:00",
    hours: "Daily · 7am–6pm",
    address: "San Marco Rd, Marco Island, FL 34145",
    lat: 25.9452,
    lng: -81.7004,
    priceLevel: 3,
    description:
      "Driving range, short-game area and 9-hole executive course with lessons by appointment.",
    image: "/assets/best-time.jpg",
  },
  {
    id: "bayfront-fish-house",
    name: "Bayfront Fish House",
    category: "dining",
    topPick: true,
    interests: ["dining", "boating-fishing"],
    time: "19:00",
    hours: "Daily · 11am–10pm",
    address: "Bald Eagle Dr, Marco Island, FL 34145",
    lat: 25.9628,
    lng: -81.7166,
    priceLevel: 2,
    description:
      "Waterfront tables on the Marco River with stone crab in season and sunset views from the dock.",
    image: "/assets/listing-restaurant.jpg",
  },
  {
    id: "island-sunrise-cafe",
    name: "Island Sunrise Café",
    category: "dining",
    interests: ["dining", "family-fun"],
    time: "08:00",
    hours: "Daily · 7am–2pm",
    address: "N Collier Blvd, Marco Island, FL 34145",
    lat: 25.9541,
    lng: -81.7214,
    priceLevel: 1,
    description:
      "Key lime pancakes, strong coffee and a shaded patio. Expect a short wait on weekends.",
    image: "/assets/cat-eat.jpg",
  },
  {
    id: "driftwood-rooftop",
    name: "Driftwood Rooftop Bar",
    category: "dining",
    interests: ["nightlife", "dining", "live-music"],
    time: "21:00",
    hours: "Wed–Sun · 4pm–midnight",
    address: "S Collier Blvd, Marco Island, FL 34145",
    lat: 25.9398,
    lng: -81.7262,
    priceLevel: 2,
    description:
      "Craft cocktails and small plates above the Gulf, with an acoustic set most Friday nights.",
    image: "/assets/blog-2.jpg",
  },
  {
    id: "gulfside-resort",
    name: "Gulfside Beach Resort",
    category: "lodging",
    topPick: true,
    interests: ["beaches", "wellness", "family-fun", "golf"],
    time: "16:00",
    hours: "Check-in 4pm · Check-out 11am",
    address: "S Collier Blvd, Marco Island, FL 34145",
    lat: 25.9362,
    lng: -81.7288,
    priceLevel: 4,
    description:
      "Beachfront rooms, a full-service spa, kids' club and golf packages on the Gulf of Mexico.",
    image: "/assets/listing-resort.jpg",
  },
  {
    id: "farmers-market",
    name: "Marco Island Farmers Market",
    category: "events",
    interests: ["shopping", "dining", "family-fun"],
    date: "2026-10-14",
    time: "08:30",
    hours: "Wed, Oct 14 · 7:30am–1pm",
    address: "Veterans Community Park, Marco Island, FL 34145",
    lat: 25.9436,
    lng: -81.7196,
    priceLevel: 0,
    description:
      "Local produce, fresh-caught seafood, baked goods and handmade crafts under the park's oaks.",
    image: "/assets/cat-shopping.jpg",
  },
  {
    id: "island-art-walk",
    name: "Island Art Walk",
    category: "events",
    interests: ["arts-culture", "shopping"],
    date: "2026-10-17",
    time: "17:00",
    hours: "Sat, Oct 17 · 5–8pm",
    address: "760 N Collier Blvd, Marco Island, FL 34145",
    lat: 25.9497,
    lng: -81.7232,
    priceLevel: 0,
    description:
      "Galleries stay open late with artist demos, wine tastings and live painting in the courtyard.",
    image: "/assets/mag-1.jpg",
  },
  {
    id: "sunset-jazz",
    name: "Sunset Jazz in the Park",
    category: "live-music",
    topPick: true,
    interests: ["live-music", "arts-culture", "nightlife"],
    date: "2026-10-10",
    time: "18:00",
    hours: "Sat, Oct 10 · 6–9pm",
    address: "Veterans Community Park, Marco Island, FL 34145",
    lat: 25.9444,
    lng: -81.7182,
    priceLevel: 0,
    description:
      "Bring a blanket for an evening of jazz standards on the lawn. Food trucks on site.",
    image: "/assets/blog-1.jpg",
  },
  {
    id: "music-on-the-docks",
    name: "Live Music on the Docks",
    category: "live-music",
    interests: ["live-music", "dining", "nightlife"],
    time: "19:30",
    hours: "Thu–Sun · 6–10pm",
    address: "Bald Eagle Dr, Marco Island, FL 34145",
    lat: 25.9612,
    lng: -81.7142,
    priceLevel: 1,
    description:
      "Rotating local bands playing island rock and reggae by the water, four nights a week.",
    image: "/assets/listing-yacht.jpg",
  },
  {
    id: "town-center-shops",
    name: "Marco Town Center Shops",
    category: "shopping",
    interests: ["shopping"],
    time: "11:00",
    hours: "Mon–Sat · 10am–6pm",
    address: "1089 N Collier Blvd, Marco Island, FL 34145",
    lat: 25.9552,
    lng: -81.7208,
    priceLevel: 2,
    description:
      "Boutiques, resort wear, beach gear and ice cream, all within an easy walk.",
    image: "/assets/travel-tip.jpg",
  },
  {
    id: "island-bike-rentals",
    name: "Island Bike & Beach Rentals",
    category: "local-services",
    interests: ["beaches", "family-fun", "wellness"],
    time: "09:00",
    hours: "Daily · 8am–5pm",
    address: "N Collier Blvd, Marco Island, FL 34145",
    lat: 25.9516,
    lng: -81.7226,
    priceLevel: 2,
    description:
      "Bikes, umbrellas, chairs and paddleboards, delivered to your rental or hotel.",
    image: "/assets/cat-services.jpg",
  },
  {
    id: "visitor-center",
    name: "Visitor Information Center",
    category: "info",
    interests: [],
    time: "10:00",
    hours: "Mon–Fri · 9am–5pm",
    address: "1102 N Collier Blvd, Marco Island, FL 34145",
    lat: 25.9561,
    lng: -81.7222,
    priceLevel: 0,
    description:
      "Maps, tide charts, event calendars and friendly local advice for first-time visitors.",
    image: "/assets/explore-hero.jpg",
  },
];

export const PLANNER_ITEMS_BY_ID = new Map(
  PLANNER_ITEMS.map((item) => [item.id, item]),
);

export function categoryLabel(id: CategoryId) {
  return PLANNER_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function interestLabel(id: Interest) {
  return INTERESTS.find((i) => i.id === id)?.label ?? id;
}
