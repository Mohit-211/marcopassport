const blog1 = "/assets/blog-1.jpg";
const blog2 = "/assets/blog-2.jpg";
const blog3 = "/assets/blog-3.jpg";

export const BLOG_CATEGORIES = [
  "All",
  "Travel Tips",
  "Food & Dining",
  "Things to Do",
  "Local Guides",
  "Experiences",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: string;
  imageCaption?: string;
  pullquote?: string;
  tip?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  read: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  intro: string;
  sections: BlogSection[];
};

const IMAGES = [blog1, blog2, blog3];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "first-time-guide",
    title: "A First-Timer's Guide to Marco Island",
    excerpt:
      "From shell-hunting at sunrise to sunset cruises — your perfect 3-day itinerary.",
    image: blog1,
    date: "May 28, 2026",
    read: "6 min read",
    category: "Local Guides",
    author: "Elena Rivers",
    authorRole: "Editor at Large",
    intro:
      "Marco Island rewards travelers who slow down. Three unhurried days are enough to fall into its rhythm — sunrise on the sand, a long lunch over the water, and a sunset that feels personal.",
    sections: [
      {
        id: "day-one",
        heading: "Day One — Settle into the island",
        paragraphs: [
          "Arrive early, drop your bags, and walk straight to the beach. The light on Crescent Beach in the morning is unhurried and soft, with shells washed in overnight by the Gulf.",
          "Have lunch somewhere with a view of the water. Don't plan your afternoon — let it plan itself.",
        ],
        image: blog2,
        imageCaption: "Crescent Beach in the early light.",
      },
      {
        id: "day-two",
        heading: "Day Two — On the water",
        paragraphs: [
          "Book a half-day sail or a guided kayak tour through the Ten Thousand Islands. The mangrove channels are quieter than you'd expect, and dolphins are common company.",
          "Return for an early dinner, ideally at a raw bar. Order the local oysters and a glass of something cold.",
        ],
        pullquote:
          "The island reveals itself slowly. The travelers who notice are the ones who came back without an itinerary.",
      },
      {
        id: "day-three",
        heading: "Day Three — Take it home",
        paragraphs: [
          "Spend the morning at Tigertail Beach with a coffee. Walk the sandbar at low tide and watch the herons fishing.",
          "Before you leave, drive south through Olde Marco for a last look at the old fishing cottages — the version of the island that hasn't changed in fifty years.",
        ],
        image: blog3,
        tip: "Sunset on the south end is best between 7:15 and 8:00. Bring a light layer — the breeze picks up quickly.",
      },
    ],
  },
  {
    slug: "best-sunset-spots",
    title: "5 Sunset Spots Locals Actually Love",
    excerpt:
      "Skip the crowds. These quiet corners of the island deliver golden hour magic.",
    image: blog2,
    date: "May 12, 2026",
    read: "4 min read",
    category: "Travel Tips",
    author: "Marco Bellini",
    authorRole: "Senior Writer",
    intro:
      "Everyone knows the resort beaches. These five spots are where islanders actually go when they want a sunset to themselves.",
    sections: [
      {
        id: "tigertail",
        heading: "Tigertail Lagoon",
        paragraphs: [
          "Park early, walk past the main beach, and follow the sandbar around the lagoon. The light here turns pink before it turns gold.",
        ],
        image: blog1,
      },
      {
        id: "south-beach",
        heading: "South Beach jetty",
        paragraphs: [
          "A locals' secret. The jetty cuts the wind and frames the sun beautifully — bring a towel and a thermos.",
        ],
        pullquote:
          "The best sunsets here aren't on the postcard beaches. They're the ones you have to walk a little for.",
      },
      {
        id: "olde-marco",
        heading: "Olde Marco docks",
        paragraphs: [
          "Less about the sand and more about the boats. Order a drink at the marina bar and watch the fishing fleet come in against the color.",
        ],
        image: blog3,
        tip: "Arrive 45 minutes before sunset. The dock fills up fast on weekends.",
      },
    ],
  },
  {
    slug: "stone-crab-season",
    title: "Stone Crab Season: Where to Eat It Best",
    excerpt: "A field guide to Marco Island's most prized seasonal delicacy.",
    image: blog3,
    date: "Apr 30, 2026",
    read: "5 min read",
    category: "Food & Dining",
    author: "Naomi Park",
    authorRole: "Food Editor",
    intro:
      "From October through May, the island's restaurants serve one of Florida's great delicacies — sweet, cold-cracked stone crab claws with mustard sauce on the side. Here's where to order them with confidence.",
    sections: [
      {
        id: "what-to-know",
        heading: "What to know before you order",
        paragraphs: [
          "Stone crab claws are sold by size — medium, large, jumbo, and colossal. The crabs themselves are returned to the water to regrow their claws, which is why the season is short and the prices are honest.",
          "Order them chilled, with mustard sauce. Drawn butter is for tourists.",
        ],
        image: blog2,
      },
      {
        id: "the-classics",
        heading: "The classics",
        paragraphs: [
          "The Tide Table and a handful of marina restaurants have served stone crab the same way for decades. There's a reason: it works.",
        ],
        pullquote:
          "If the menu lists the boat that brought in the claws, you're in the right place.",
        tip: "Always ask what came in that morning. Stone crab is best within 24 hours of the boat.",
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedBlogs(slug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

// Extended seed used by the blog index — recycles images
const EXTRA: Array<
  Omit<BlogPost, "sections" | "intro" | "authorRole" | "image"> & {
    image: string;
  }
> = [
  {
    slug: "kayak-the-mangroves",
    title: "Kayaking the Ten Thousand Islands",
    excerpt:
      "Paddle through hidden mangrove tunnels with a naturalist who knows every turn.",
    date: "Apr 18, 2026",
    read: "7 min read",
    category: "Things to Do",
    author: "Diego Romero",
    image: IMAGES[0],
  },
  {
    slug: "boutique-stays",
    title: "Boutique Stays Beyond the Big Resorts",
    excerpt:
      "Six intimate hideaways for travelers who want quiet luxury and a sense of place.",
    date: "Apr 04, 2026",
    read: "5 min read",
    category: "Local Guides",
    author: "Elena Rivers",
    image: IMAGES[1],
  },
  {
    slug: "morning-rituals",
    title: "A Slow Morning on Crescent Beach",
    excerpt: "Coffee, salt air and the kind of sunrise that resets your week.",
    date: "Mar 22, 2026",
    read: "3 min read",
    category: "Experiences",
    author: "Marco Bellini",
    image: IMAGES[2],
  },
  {
    slug: "raw-bars",
    title: "The Island's Best Raw Bars, Ranked",
    excerpt:
      "Oysters, ceviche and crisp white wine — our editors weigh in on the season's standouts.",
    date: "Mar 10, 2026",
    read: "4 min read",
    category: "Food & Dining",
    author: "Naomi Park",
    image: IMAGES[1],
  },
  {
    slug: "shelling-guide",
    title: "A Beginner's Guide to Shelling",
    excerpt:
      "When to go, what to look for and how to leave the beach better than you found it.",
    date: "Feb 26, 2026",
    read: "5 min read",
    category: "Travel Tips",
    author: "Diego Romero",
    image: IMAGES[2],
  },
  {
    slug: "sailing-charters",
    title: "Private Sails: How to Choose the Right Charter",
    excerpt:
      "From sunset cruises to full-day adventures, here's how to pick the perfect boat.",
    date: "Feb 12, 2026",
    read: "6 min read",
    category: "Things to Do",
    author: "Marco Bellini",
    image: IMAGES[0],
  },
];

// Index/listing-ready cards (full posts + extras stripped to card shape)
export type BlogCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  read: string;
  category: BlogCategory;
  author: string;
};

export const BLOG_CARDS: BlogCard[] = [
  ...BLOG_POSTS.map(
    ({ slug, title, excerpt, image, date, read, category, author }) => ({
      slug,
      title,
      excerpt,
      image,
      date,
      read,
      category,
      author,
    })
  ),
  ...EXTRA,
];
