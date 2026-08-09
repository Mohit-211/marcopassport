const placeTigertail = "/assets/place-tigertail.jpg";
const placeMuseum = "/assets/place-museum.jpg";
const placeOtterMound = "/assets/place-otter-mound.jpg";
const placeMarina = "/assets/place-marina.jpg";
const placeSouthBeach = "/assets/place-south-beach.jpg";
const placeRookeryBay = "/assets/place-rookery-bay.jpg";
const placeBoatTour = "/assets/place-cruise.jpg";

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
    blurb:
      "A powder-sand beach and shallow lagoon famous islandwide for shelling.",
    image: placeTigertail,
    gallery: [placeTigertail, placeOtterMound, placeSouthBeach, placeMarina],
    tag: "Beach",
    span: "wide",
    featured: true,
    story: [
      "Tigertail is one of Marco Island's most-loved beaches, known for its calm shallow lagoon and the sandbar spit locals call Sand Dollar Island. Visitors consistently mention it as one of the best shelling beaches on Florida's Gulf Coast.",
      "The catch: the walk from the parking lot to the main beach runs a half mile or more along a boardwalk and lagoon crossing. Most people say it's worth every step once they reach the open sand.",
    ],
    expectations: [
      {
        icon: "wave",
        label: "Shallow lagoon",
        detail: "Wade-friendly water between the parking area and the beach.",
      },
      {
        icon: "sun",
        label: "Great for shelling",
        detail: "Sand dollars and shells wash up reliably at low tide.",
      },
      {
        icon: "family",
        label: "Restrooms on-site",
        detail: "Facilities are in the parking lot, not on the beach itself.",
      },
      {
        icon: "compass",
        label: "Long walk in",
        detail: "Roughly 0.5 mile from parking to the main beach — pack light.",
      },
    ],
    info: {
      address: "430 Hernando Dr, Marco Island, FL 34145",
      hours: "Open daily, dawn to dusk",
      fee: "Metered parking on-site",
      parking: "Pay-by-machine lot; fills up by late morning on weekends",
      tips: [
        "Go near low tide for the best shelling on the sandbar.",
        "Water shoes help — the lagoon floor has scattered shells.",
        "There's little shade past the boardwalk, so bring your own.",
        "Kayak and paddleboard rentals are available near the entrance.",
      ],
    },
  },
  {
    id: "south-beach",
    name: "South Beach, Marco Island",
    tagline: "Wide white sand, a long sandbar, and the island's best sunsets.",
    blurb: "Soft white sand and a sandbar that stretches out for a long swim.",
    image: placeSouthBeach,
    gallery: [placeSouthBeach, placeTigertail, placeMarina],
    tag: "Beach",
    span: "tall",
    featured: true,
    story: [
      "South Beach is the island's other major public beach, reached via the South Beach public access on County Road 951. Visitors regularly rate it among the best beaches they've been to in Florida, citing the soft sand, clear water, and a sandbar that lets you wade out surprisingly far.",
      "It's less of a production than Tigertail — a fairly direct walk from the lot to the shoreline — and it's a favorite spot to watch the sun go down over the Gulf.",
    ],
    expectations: [
      {
        icon: "sun",
        label: "Sunset spot",
        detail: "West-facing shoreline with unobstructed Gulf views.",
      },
      {
        icon: "wave",
        label: "Long sandbar",
        detail: "Wade out a long way and still stand in places.",
      },
      {
        icon: "family",
        label: "Playground nearby",
        detail: "Restrooms and a kids' play area at the public access lot.",
      },
      {
        icon: "camera",
        label: "Great for shelling",
        detail: "Visitors regularly find a wide variety of shells here.",
      },
    ],
    info: {
      address: "870 County Rd 951, Marco Island, FL 34145",
      hours: "Open 24 hours",
      fee: "Paid parking lots (pay-by-plate)",
      parking:
        "Two lots near the inlet/jetty; roughly a 0.5-mile walk to the water",
      tips: [
        "Arrive early for sunset — the good spots fill up.",
        "No showers at the lot, so plan to rinse off at home.",
        "Bring a phone for pay-by-plate parking.",
      ],
    },
  },
  {
    id: "museum",
    name: "Marco Island Historical Museum",
    tagline:
      "Walk the long story of the Calusa people and the island's frontier era.",
    blurb:
      "The story of the Calusa people, told through the island's own artifacts.",
    image: placeMuseum,
    gallery: [placeMuseum, placeMarina],
    tag: "Culture",
    story: [
      "Long before Marco was a resort island, it was a hub of the Calusa people, whose culture is documented here through artifacts uncovered on the island itself — including replicas tied to the famous Key Marco Cat. Reviewers consistently call it a small museum that punches well above its size.",
      "Rotating exhibits on regional photography and pioneer-era history add to the permanent Calusa and settlement-era displays. Most visits run about an hour.",
    ],
    expectations: [
      {
        icon: "family",
        label: "All ages",
        detail: "Interactive exhibits and activities for kids.",
      },
      {
        icon: "leaf",
        label: "Indoor & cool",
        detail: "A good break from the midday heat.",
      },
      {
        icon: "sparkle",
        label: "Free entry",
        detail: "Free admission; donations support the museum.",
      },
      {
        icon: "compass",
        label: "Closed Sun & Mon",
        detail: "Plan your visit for Tuesday through Saturday.",
      },
    ],
    info: {
      address: "180 S Heathwood Dr, Marco Island, FL 34145",
      hours: "Tue–Sat, 9:00 AM–4:00 PM · Closed Sun & Mon",
      fee: "Free · donations welcome",
      parking: "Free on-site lot",
      tips: [
        "Ask about docent-led tours — reviewers say they add a lot.",
        "Check for rotating photography and history exhibits.",
        "Pair with a stroll through the nearby Old Marco district.",
      ],
    },
  },
  {
    id: "otter-mound",
    name: "Otter Mound Preserve",
    tagline: "A quiet shell-mound trail tucked into a residential street.",
    blurb: "A short trail through Calusa-era shell mounds over 40 feet high.",
    image: placeOtterMound,
    gallery: [placeOtterMound, placeMuseum],
    tag: "Nature & History",
    story: [
      "Easy to drive past, Otter Mound Preserve is a small county-run site built on ancient Calusa shell mounds — some over 40 feet high. A short mulch path winds past native trees, a striking whelk-shell garden wall, and historical markers explaining the site.",
      "It's not a long visit, but reviewers consistently call it a worthwhile, easy-to-miss stop for anyone interested in the island's pre-history.",
    ],
    expectations: [
      {
        icon: "leaf",
        label: "Short & easy",
        detail: "A brief, flat walk suitable for most visitors.",
      },
      {
        icon: "compass",
        label: "Historical markers",
        detail: "Signage explains the Calusa shell-mound history.",
      },
      {
        icon: "sun",
        label: "Best in cooler months",
        detail: "Fall is noted as a good time for migrating birds.",
      },
      {
        icon: "family",
        label: "Free to visit",
        detail: "No admission fee; open daily.",
      },
    ],
    info: {
      address: "1831 Addison Ct, Marco Island, FL 34145",
      hours: "Daily, 7:00 AM–7:00 PM",
      fee: "Free",
      parking: "Small on-street lot — easy to miss, go slow",
      tips: [
        "Watch for the entrance — it's easy to drive right past.",
        "Some reviewers note spiderwebs on the narrower sections of trail.",
        "Read the shell-wall marker before you walk the loop.",
      ],
    },
  },
  {
    id: "marina",
    name: "Esplanade Marina",
    tagline: "Yacht-lined docks and waterfront dining on the bay.",
    blurb: "A Mediterranean-style marina village with waterfront dining.",
    image: placeMarina,
    gallery: [placeMarina, placeBoatTour, placeSouthBeach],
    tag: "Marina",
    story: [
      "The Esplanade pairs a working marina with a small village of waterfront shops and restaurants. Charter boats and sunset cruises depart from its docks throughout the day, and visitors often stop by simply to stroll past the yachts before dinner.",
      "Restaurants here face west toward the water, making it a popular, easy-access spot for a sunset meal without needing a boat.",
    ],
    expectations: [
      {
        icon: "sparkle",
        label: "Sunset dining",
        detail: "Multiple waterfront restaurants face the water.",
      },
      {
        icon: "compass",
        label: "Charter hub",
        detail: "Fishing, sailing, and dolphin tours depart from here.",
      },
      {
        icon: "family",
        label: "Easy to visit",
        detail: "Walkable with on-site parking.",
      },
      {
        icon: "camera",
        label: "Photogenic docks",
        detail: "Yachts and golden-hour reflections along the marina.",
      },
    ],
    info: {
      address: "760 N Collier Blvd, Marco Island, FL 34145",
      hours: "Marina grounds open daily; restaurant hours vary",
      fee: "Free to visit",
      parking: "On-site lot; can fill up on weekends",
      tips: [
        "Reserve ahead for waterfront dining, especially on weekends.",
        "Boaters should call the dockmaster ahead for dinghy dock access.",
        "Good spot for an evening stroll even without a dinner reservation.",
      ],
    },
  },
  {
    id: "rookery-bay",
    name: "Rookery Bay Environmental Learning Center",
    tagline: "Touch tanks, trails, and one of Florida's last great estuaries.",
    blurb:
      "A 110,000-acre estuarine reserve with trails, exhibits, and touch tanks.",
    image: placeRookeryBay,
    gallery: [placeRookeryBay, placeOtterMound],
    tag: "Wildlife",
    featured: true,
    story: [
      "A short drive from Marco Island, Rookery Bay protects one of the largest undeveloped mangrove estuaries left in the country. The Learning Center brings it to life with a touch tank, aquariums, a butterfly garden, and boardwalk trails.",
      "Reviewers frequently highlight the knowledgeable docents at the touch tank and the boat tours (when available) as the highlight of a visit — book ahead, as boat slots fill quickly.",
    ],
    expectations: [
      {
        icon: "leaf",
        label: "Conservation site",
        detail: "A 110,000-acre National Estuarine Research Reserve.",
      },
      {
        icon: "family",
        label: "Hands-on exhibits",
        detail: "Touch tanks and aquariums suited to kids and adults alike.",
      },
      {
        icon: "camera",
        label: "Birding",
        detail: "Herons, ospreys, and other wading birds along the trails.",
      },
      {
        icon: "compass",
        label: "Closed Sun & Mon",
        detail: "Open Tuesday through Saturday only.",
      },
    ],
    info: {
      address: "300 Tower Rd, Naples, FL 34113",
      hours: "Tue–Sat, 10:00 AM–4:00 PM · Closed Sun & Mon",
      fee: "Modest admission fee for adults and children",
      parking: "Free on-site lot",
      tips: [
        "Book any guided boat tour in advance — they sell out.",
        "Bring bug spray for the outdoor boardwalk trails.",
        "Ask a docent at the touch tank — reviewers say they make the visit.",
      ],
    },
  },
  {
    id: "boat-tour",
    name: "Ten Thousand Islands Dolphin & Shelling Tour",
    tagline: "Glide past mangrove channels alongside dolphins and manatees.",
    blurb:
      "Small-boat tours into the Ten Thousand Islands from nearby Goodland.",
    image: placeBoatTour,
    gallery: [placeBoatTour, placeMarina, placeRookeryBay],
    tag: "Boat Tour",
    story: [
      "Several local operators run small-boat tours out of Goodland, just east of Marco Island, into the Ten Thousand Islands — a maze of mangrove islands south of the mainland. Trips typically combine dolphin-watching with a stop on an uninhabited island for shelling.",
      "Captains are consistently the highlight in reviews: most are longtime locals who know the resident dolphin pods by their dorsal fins and tailor each trip to what guests want to see.",
    ],
    expectations: [
      {
        icon: "wave",
        label: "Dolphins & manatees",
        detail: "Sightings are reported on the large majority of trips.",
      },
      {
        icon: "leaf",
        label: "Uninhabited islands",
        detail:
          "Most tours stop at a shell-covered island inaccessible by car.",
      },
      {
        icon: "family",
        label: "2–3 hour trips",
        detail: "Family-friendly length with shaded seating on most boats.",
      },
      {
        icon: "compass",
        label: "Book ahead",
        detail: "Popular time slots and sunset trips fill up in season.",
      },
    ],
    info: {
      address: "Departures from Goodland, FL 34140 (near Marco Island)",
      hours: "Daily tours, typically morning through sunset",
      fee: "Tours generally run in the range of a half-day charter price per person",
      parking: "Free at most departure docks",
      tips: [
        "Book directly with a local operator a few days ahead in season.",
        "Bring reef-safe sunscreen and a hat — there's little shade on the water.",
        "Ask if a shelling-island stop is included — most tours offer one.",
      ],
    },
  },
];

export const placesById: Record<string, Place> = Object.fromEntries(
  places.map((p) => [p.id, p])
);
