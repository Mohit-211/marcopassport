export const categories = [
  {
    slug: "stay",
    name: "Places to Stay",
    description: "Resorts, boutique hotels & vacation rentals",
    image: "/assets/cat-stay.jpg",
    count: 48,
  },
  {
    slug: "eat",
    name: "Places to Eat",
    description: "Waterfront dining, seafood & local bites",
    image: "/assets/cat-eat.jpg",
    count: 76,
  },
  {
    slug: "activities",
    name: "Fun Activities",
    description: "Kayaking, sailing, eco-tours & more",
    image: "/assets/cat-activities.jpg",
    count: 54,
  },
  {
    slug: "shopping",
    name: "Shopping",
    description: "Boutiques, galleries & island markets",
    image: "/assets/cat-shopping.jpg",
    count: 32,
  },
  {
    slug: "services",
    name: "Local Services",
    description: "Spa, wellness, real estate & beyond",
    image: "/assets/cat-services.jpg",
    count: 41,
  },
] as const;

export const featuredListings = [
  {
    id: "jw-marriott-marco-island",
    name: "JW Marriott Marco Island Beach Resort",
    category: "Places to Stay",
    image: "/assets/listing-resort.jpg",
    rating: 4.5,
    price: "$$$$",
    location: "400 S Collier Blvd",
    description:
      "Beachfront pools, an adults-only Sirene wing, and multiple on-site restaurants steps from the sand.",
    featured: true,
  },
  {
    id: "snook-inn",
    name: "Snook Inn",
    category: "Places to Eat",
    image: "/assets/listing-restaurant.jpg",
    rating: 4.4,
    price: "$$",
    location: "1215 Bald Eagle Dr",
    description:
      "Waterfront tiki dining with live music, a salad bar, and dock access for boaters coming in off the water.",
    featured: true,
  },
  {
    id: "adventure81-marco",
    name: "Adventure81 Marco Sunset Cruises",
    category: "Fun Activities",
    image: "/assets/listing-yacht.jpg",
    rating: 4.8,
    price: "$$$",
    location: "Near Marco Island",
    description:
      "Small-group sunset cruises through the intercoastal waterway with drinks, snacks, and dolphin sightings included.",
    featured: true,
  },
] as const;

export const topPlaces = [
  {
    name: "Tigertail Beach",
    blurb:
      "A powder-sand beach and shallow lagoon famous islandwide for shelling.",
    image: "/assets/place-tigertail.jpg",
  },
  {
    name: "Marco Island Historical Museum",
    blurb:
      "The story of the Calusa people, told through artifacts found on the island itself.",
    image: "/assets/place-museum.jpg",
  },
  {
    name: "Ten Thousand Islands Dolphin & Shelling Tour",
    blurb: "Glide through mangrove channels alongside dolphins and manatees.",
    image: "/assets/place-cruise.jpg",
  },
] as const;

export const magazines = [
  {
    title: "Coastal Escapes",
    issue: "Issue 01",
    cover: "/assets/mag-1.jpg",
  },
  {
    title: "Taste of the Island",
    issue: "Issue 02",
    cover: "/assets/mag-2.jpg",
  },
  {
    title: "Wild Waters",
    issue: "Issue 03",
    cover: "/assets/mag-3.jpg",
  },
  {
    title: "Coastal Escapes",
    issue: "Issue 04",
    cover: "/assets/mag-1.jpg",
  },
  {
    title: "Taste of the Island",
    issue: "Issue 05",
    cover: "/assets/mag-2.jpg",
  },
] as const;

export const blogPosts = [
  {
    slug: "first-time-guide",
    title: "A First-Timer's Guide to Marco Island",
    date: "May 28, 2026",
    read: "6 min read",
    image: "/assets/blog-1.jpg",
    excerpt:
      "From shell-hunting at sunrise to sunset cruises. Your perfect 3-day itinerary.",
  },
  {
    slug: "best-sunset-spots",
    title: "5 Sunset Spots Locals Actually Love",
    date: "May 12, 2026",
    read: "4 min read",
    image: "/assets/blog-2.jpg",
    excerpt:
      "Skip the crowds. These quiet corners of the island deliver golden hour magic.",
  },
  {
    slug: "stone-crab-season",
    title: "Stone Crab Season: Where to Eat It Best",
    date: "Apr 30, 2026",
    read: "5 min read",
    image: "/assets/blog-3.jpg",
    excerpt: "A field guide to Marco Island's most prized seasonal delicacy.",
  },
] as const;
