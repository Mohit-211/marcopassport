const placeTigertail = "/assets/place-tigertail.jpg";
const placeMuseum = "/assets/place-museum.jpg";
const placeCruise = "/assets/place-cruise.jpg";
const placeMarina = "/assets/place-marina.jpg";
const placeMangrove = "/assets/place-mangrove.jpg";
const placeSunset = "/assets/place-sunset.jpg";
const placeCaxambas = "/assets/place-caxambas.jpg";
const placeWildlife = "/assets/place-wildlife.jpg";

export type PlaceExpectation = {
  icon: "sun" | "wave" | "family" | "camera" | "leaf" | "compass" | "sparkle";
  label: string;
  detail: string;
};

export type PlaceInfo = {
  address: string;
  hours: string;
  fee: string;
  parking: string;
  tips: string[];
};

export type Place = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
  gallery: string[];
  tag: string;
  span?: "wide" | "tall" | "default";
  featured?: boolean;
  story: string[];
  expectations: PlaceExpectation[];
  info: PlaceInfo;
};

export const places: Place[] = [
  {
    id: "tigertail",
    name: "Tigertail Beach",
    tagline:
      "Where the lagoon meets the Gulf and the shells outnumber the footprints.",
    blurb: "Powder sand and a tranquil lagoon famous for shelling at low tide.",
    image: placeTigertail,
    gallery: [
      placeTigertail,
      placeSunset,
      placeWildlife,
      placeCaxambas,
      placeMangrove,
    ],
    tag: "Beach",
    span: "wide",
    featured: true,
    story: [
      "Tigertail isn't a beach in the postcard sense — it's a slow ritual. You park beneath the sea grapes, cross a wooden boardwalk and arrive at a glassy lagoon that mirrors the morning sky before you ever reach the Gulf itself.",
      "Wade across the lagoon and you'll find Sand Dollar Island: a thin spit of pure white sand where the only sound is the wind and the soft churn of the surf. Locals come here for the shelling — sand dollars, scotch bonnets, the occasional perfect olive — and stay for the silence.",
      "By late afternoon the light softens into something cinematic. Bring a blanket, a book and nothing else. The island will take care of the rest.",
    ],
    expectations: [
      {
        icon: "sun",
        label: "Best at sunrise",
        detail: "Low tide reveals the shell beds and sandbar walk.",
      },
      {
        icon: "wave",
        label: "Calm & shallow",
        detail: "Lagoon is wade-friendly — perfect for little ones.",
      },
      {
        icon: "family",
        label: "Family-friendly",
        detail: "Restrooms, kayak rentals and a small concession on-site.",
      },
      {
        icon: "camera",
        label: "Cinematic light",
        detail: "Golden hour reflects off the lagoon — bring a camera.",
      },
    ],
    info: {
      address: "490 Hernando Drive, Marco Island, FL 34145",
      hours: "Open daily · 8:00 AM – Sunset",
      fee: "$8 parking · Beach access free",
      parking: "Paved lot, fills by 11 AM on weekends",
      tips: [
        "Arrive within an hour of low tide for the best shelling.",
        "Pack water shoes — the lagoon floor has the occasional shell.",
        "Sunscreen and a hat are non-negotiable. There's no shade past the boardwalk.",
        "Kayak and paddleboard rentals available near the entrance.",
      ],
    },
  },
  {
    id: "caxambas",
    name: "Caxambas Pass",
    tagline:
      "A turquoise inlet where the Gulf and the islands quietly trade places.",
    blurb: "Turquoise inlet meeting Gulf — a sandbar disappearing act.",
    image: placeCaxambas,
    gallery: [
      placeCaxambas,
      placeWildlife,
      placeMarina,
      placeSunset,
      placeCruise,
    ],
    tag: "Aerial view",
    span: "tall",
    featured: true,
    story: [
      "At the southern tip of the island, Caxambas Pass quietly performs one of Marco's most beautiful disappearing acts. At high tide, a thin ribbon of sand vanishes beneath the turquoise; six hours later, it reappears, wide enough to walk for a quarter mile.",
      "It's the kind of place that rewards a boat — or a long paddle from the launch. Dolphins are common in the channel, and the colors of the water shift from emerald to deep teal in the span of a wingbeat.",
    ],
    expectations: [
      {
        icon: "wave",
        label: "Boaters' paradise",
        detail: "Best accessed by boat, kayak or paddleboard.",
      },
      {
        icon: "camera",
        label: "Aerial-worthy",
        detail: "Bring a drone (where permitted) — the water is unreal.",
      },
      {
        icon: "leaf",
        label: "Untouched",
        detail: "No facilities. Pack in, pack out.",
      },
      {
        icon: "compass",
        label: "Adventurous",
        detail: "Currents are strong at the pass — watch the tide chart.",
      },
    ],
    info: {
      address:
        "909 Collier Court, Marco Island, FL 34145 (Caxambas Park boat ramp)",
      hours: "Open daily · Sunrise – Sunset",
      fee: "$10 boat ramp · Free walk-in",
      parking: "Boat trailer & passenger parking on-site",
      tips: [
        "Check the tide chart — the sandbar is only walkable around low tide.",
        "Bring water, snacks and reef-safe sunscreen.",
        "No lifeguards. Strong currents at the pass — adults only past the bar.",
      ],
    },
  },
  {
    id: "marina",
    name: "Esplanade Marina",
    tagline:
      "Yacht-lined docks, sunset cocktails and the slow rhythm of the bay.",
    blurb: "Yacht-lined docks and sunset cocktails on the water.",
    image: placeMarina,
    gallery: [
      placeMarina,
      placeSunset,
      placeCruise,
      placeWildlife,
      placeTigertail,
    ],
    tag: "Marina",
    story: [
      "The Esplanade is Marco's living room on the water. A Mediterranean-style village wraps a working marina, where charter captains untie at dawn and sunset cruisers gather by six.",
      "Stroll the docks past gleaming yachts, then settle in at one of the waterfront restaurants. Order something cold, watch the boats come in, and let the afternoon stretch.",
    ],
    expectations: [
      {
        icon: "sparkle",
        label: "Sunset dining",
        detail: "Multiple waterfront restaurants face west.",
      },
      {
        icon: "compass",
        label: "Charter hub",
        detail: "Fishing, sailing and dolphin tours depart here.",
      },
      {
        icon: "family",
        label: "Easy to visit",
        detail: "Walkable, ample parking, family-friendly.",
      },
      {
        icon: "camera",
        label: "Photogenic",
        detail: "Yachts, palms and golden-hour reflections.",
      },
    ],
    info: {
      address: "740 N Collier Blvd, Marco Island, FL 34145",
      hours: "Marina open daily · Restaurants vary",
      fee: "Free to visit",
      parking: "Free on-site lot",
      tips: [
        "Reservations recommended for waterfront dining on weekends.",
        "Sunset cruise departures fill up — book a day ahead in season.",
        "Restrooms inside the Esplanade shops.",
      ],
    },
  },
  {
    id: "mangrove",
    name: "Mangrove Tunnels",
    tagline: "Paddle into a green cathedral where the world goes quiet.",
    blurb: "Kayak through a green cathedral in the Ten Thousand Islands.",
    image: placeMangrove,
    gallery: [
      placeMangrove,
      placeCruise,
      placeWildlife,
      placeTigertail,
      placeCaxambas,
    ],
    tag: "Adventure",
    featured: true,
    story: [
      "Slip a kayak into the channels north of the island and within minutes the noise of the world falls away. The mangroves arch overhead into a tunnel of green light, the only sound the dip of the paddle and the click of unseen wildlife.",
      "Guided tours leave from Shurr Adventure and Marco Island Sea Excursions — but experienced paddlers can rent and explore. Keep an eye out for roseate spoonbills, snowy egrets and the occasional manatee gliding underneath.",
    ],
    expectations: [
      {
        icon: "leaf",
        label: "Wildlife-rich",
        detail: "Manatees, dolphins and roseate spoonbills.",
      },
      {
        icon: "wave",
        label: "Calm water",
        detail: "Sheltered channels — beginner-friendly with a guide.",
      },
      {
        icon: "compass",
        label: "Guided or solo",
        detail: "2-hour tours from $65, rentals from $40.",
      },
      {
        icon: "camera",
        label: "Surreal light",
        detail: "The green tunnel light is unlike anywhere else.",
      },
    ],
    info: {
      address: "Multiple launch points · Shurr Adventure, Caxambas, Goodland",
      hours: "Tours daily · 8 AM, 11 AM, 2 PM",
      fee: "Tours from $65 · Rentals from $40/half-day",
      parking: "Free at most launch points",
      tips: [
        "Wear quick-dry clothes and water shoes.",
        "Bring a dry bag, water and bug spray.",
        "Book guided tours — first-timers will love the local commentary.",
      ],
    },
  },
  {
    id: "museum",
    name: "Marco Island Historical Museum",
    tagline:
      "Walk the long story of the Calusa, the frontier and the island today.",
    blurb: "The story of the Calusa people and the island's frontier era.",
    image: placeMuseum,
    gallery: [
      placeMuseum,
      placeMarina,
      placeTigertail,
      placeSunset,
      placeWildlife,
    ],
    tag: "Culture",
    story: [
      "Long before Marco was a resort island, it was the southern capital of the Calusa — a fishing civilization that thrived here for two thousand years. The museum tells their story with care, alongside exhibits on the pioneer-era clam canneries and the island's mid-century transformation.",
      "It's a small museum, but a generous one. Allow an unhurried hour, more if a docent is leading a walk.",
    ],
    expectations: [
      {
        icon: "family",
        label: "Family-friendly",
        detail: "Interactive exhibits suited to all ages.",
      },
      {
        icon: "leaf",
        label: "Indoor & cool",
        detail: "A welcome break from midday sun.",
      },
      {
        icon: "sparkle",
        label: "Free entry",
        detail: "Donations support the Friends of the Museum.",
      },
      {
        icon: "compass",
        label: "Quick visit",
        detail: "Plan for 45–90 minutes.",
      },
    ],
    info: {
      address: "180 S Heathwood Dr, Marco Island, FL 34145",
      hours: "Tue – Sat · 9 AM – 4 PM · Closed Sun & Mon",
      fee: "Free · Donations welcome",
      parking: "Free on-site lot",
      tips: [
        "Check the calendar for docent-led tours and lectures.",
        "Pair with a stop at the Old Marco district nearby.",
        "Gift shop has excellent regional books.",
      ],
    },
  },
  {
    id: "sunset-pier",
    name: "South Beach Pier",
    tagline: "Florida's most reliable front-row seat for golden hour.",
    blurb: "Florida's most reliable front-row seat for golden hour.",
    image: placeSunset,
    gallery: [
      placeSunset,
      placeTigertail,
      placeMarina,
      placeCaxambas,
      placeWildlife,
    ],
    tag: "Sunset",
    span: "wide",
    story: [
      "Every evening, a quiet procession of locals and visitors gathers at the south end of the beach. They bring chairs, dogs, glasses of wine. They wait. And then the sky goes through every color it knows.",
      "It's a small ritual that defines the island. Stay for the afterglow — the ten minutes after the sun is gone, when the clouds turn rose and the water mirrors them back.",
    ],
    expectations: [
      {
        icon: "sun",
        label: "Sunset perfect",
        detail: "West-facing — sun sets directly over the Gulf.",
      },
      {
        icon: "family",
        label: "Everyone welcome",
        detail: "Dogs, kids, picnics — it's a community moment.",
      },
      {
        icon: "wave",
        label: "Walk the shore",
        detail: "Miles of beach for an after-dinner stroll.",
      },
      {
        icon: "camera",
        label: "Iconic photos",
        detail: "Bring a camera — every evening is different.",
      },
    ],
    info: {
      address: "S Collier Blvd & Swallow Ave, Marco Island, FL 34145",
      hours: "Open 24h · Beach access free",
      fee: "Free",
      parking: "Resident lot · Visitor parking nearby ($8)",
      tips: [
        "Arrive 30 minutes before sunset for the best spot.",
        "Bring a low chair, layers, and bug spray for after-dark.",
        "No glass on the beach — use a thermos.",
      ],
    },
  },
  {
    id: "cruise",
    name: "Ten Thousand Islands",
    tagline: "Glide past mangrove channels alongside dolphins and ospreys.",
    blurb: "Glide past mangrove channels alongside dolphins and ospreys.",
    image: placeCruise,
    gallery: [
      placeCruise,
      placeMangrove,
      placeWildlife,
      placeMarina,
      placeCaxambas,
    ],
    tag: "Cruise",
    story: [
      "South of Marco, the coast dissolves into a labyrinth of mangrove islands — ten thousand of them, depending who's counting. A half-day cruise is the easiest way in.",
      "Captains know where the dolphins feed, where the bald eagles nest and where to slow down so the kids can spot a manatee in the shallows.",
    ],
    expectations: [
      {
        icon: "wave",
        label: "On the water",
        detail: "Catamarans, eco-boats and private charters.",
      },
      {
        icon: "leaf",
        label: "Wildlife guaranteed",
        detail: "Dolphin and bird sightings on most trips.",
      },
      {
        icon: "family",
        label: "All ages",
        detail: "Most tours are 2–3 hours, kid-friendly.",
      },
      { icon: "camera", label: "Big sky views", detail: "Bring a wide lens." },
    ],
    info: {
      address: "Departures from Esplanade & Rose Marina",
      hours: "Daily · 9 AM, 12 PM, 3 PM, sunset",
      fee: "From $55/adult · Sunset cruises $75",
      parking: "Free at the marinas",
      tips: [
        "Book sunset cruises in advance — they sell out.",
        "Bring layers — it's breezy on the water.",
        "Most boats have restrooms and a small bar.",
      ],
    },
  },
  {
    id: "wildlife",
    name: "Rookery Bay",
    tagline: "Wading birds, manatees and untouched estuary at first light.",
    blurb: "Wading birds, manatees and untouched estuary at first light.",
    image: placeWildlife,
    gallery: [
      placeWildlife,
      placeMangrove,
      placeCruise,
      placeTigertail,
      placeSunset,
    ],
    tag: "Wildlife",
    span: "tall",
    story: [
      "Rookery Bay protects 110,000 acres of estuary just east of the island — one of the few mangrove ecosystems left in this kind of shape anywhere in the country. The Environmental Learning Center is the way in.",
      "Walk the boardwalk trails at first light to catch wading birds at their busiest. The on-site aquariums and exhibits make sense of what you're seeing outside.",
    ],
    expectations: [
      {
        icon: "leaf",
        label: "Conservation site",
        detail: "110,000-acre National Estuarine Reserve.",
      },
      {
        icon: "family",
        label: "Learning Center",
        detail: "Aquariums, exhibits and guided walks.",
      },
      {
        icon: "camera",
        label: "Birding heaven",
        detail: "Roseate spoonbills, herons, ospreys, eagles.",
      },
      {
        icon: "sun",
        label: "Best at dawn",
        detail: "Wildlife is most active before 9 AM.",
      },
    ],
    info: {
      address: "300 Tower Rd, Naples, FL 34113",
      hours: "Mon – Sat · 9 AM – 4 PM",
      fee: "$5 adults · $3 children",
      parking: "Free on-site",
      tips: [
        "Bring binoculars and bug spray.",
        "Sign up for a guided boat tour for the full experience.",
        "Café on-site for a light lunch.",
      ],
    },
  },
];

export const placesById: Record<string, Place> = Object.fromEntries(
  places.map((p) => [p.id, p])
);
