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
    id: "marco-grand-resort",
    name: "Marco Grand Beachfront Resort",
    category: "Places to Stay",
    image: "/assets/listing-resort.jpg",
    rating: 4.9,
    price: "$$$$",
    location: "South Collier Blvd",
    description:
      "Twilight-lit infinity pools, white-glove service and a private stretch of Crescent Beach steps away.",
    featured: true,
  },
  {
    id: "tide-table",
    name: "The Tide Table",
    category: "Places to Eat",
    image: "/assets/listing-restaurant.jpg",
    rating: 4.8,
    price: "$$$",
    location: "Marco Marina",
    description:
      "Sunset dining over the marina with line-caught grouper, hand-shucked oysters and Florida-grown cocktails.",
    featured: true,
  },
  {
    id: "azure-charters",
    name: "Azure Sailing Charters",
    category: "Fun Activities",
    image: "/assets/listing-yacht.jpg",
    rating: 5.0,
    price: "$$$",
    location: "Esplanade Marina",
    description:
      "Half-day private sails through the Ten Thousand Islands. Captain, snacks and turquoise water included.",
    featured: true,
  },
] as const;

export const topPlaces = [
  {
    name: "Tigertail Beach",
    blurb:
      "Powder-soft sand and a tranquil lagoon famous for shelling at low tide.",
    image: "/assets/place-tigertail.jpg",
  },
  {
    name: "Marco Island Historical Museum",
    blurb:
      "Step into the story of the Calusa people and the island's frontier era.",
    image: "/assets/place-museum.jpg",
  },
  {
    name: "Ten Thousand Islands Cruise",
    blurb: "Glide through mangrove channels alongside dolphins and ospreys.",
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
