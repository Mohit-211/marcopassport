const mag1 = "/assets/mag-1.jpg";
const mag2 = "/assets/mag-2.jpg";
const mag3 = "/assets/mag-3.jpg";
const placeSunset = "/assets/place-sunset.jpg";
const placeMangrove = "/assets/place-mangrove.jpg";
const placeTigertail = "/assets/place-tigertail.jpg";
const placeMarina = "/assets/place-marina.jpg";
const placeWildlife = "/assets/place-wildlife.jpg";

export type MagazineSection = { kicker: string; title: string; image: string };

export type Magazine = {
  slug: string;
  title: string;
  issue: string;
  season: string;
  date: string;
  pages: number;
  cover: string;
  tagline: string;
  description: string;
  letter: string[];
  sections: MagazineSection[];
  featured?: boolean;
  archived?: boolean;
};

export const magazines: Magazine[] = [
  {
    slug: "coastal-escapes-06",
    title: "Coastal Escapes",
    issue: "Issue 06",
    season: "Summer 2026",
    date: "June 2026",
    pages: 124,
    cover: mag1,
    tagline: "A slow guide to a long Florida summer.",
    description:
      "The summer edition — sun-drenched dispatches, hidden coves, and the slow art of doing nothing well.",
    letter: [
      "We made this issue for the long days. The ones that begin with coffee on the dock and end with bare feet on warm sand. Marco Island in summer is a different animal — slower, brighter, more generous with its hours.",
      "Inside, you'll find a field guide to the island's quietest beaches, a love letter to stone crab season's last week, and a portfolio from photographer Anya Reyes — who spent a month chasing the green flash from South Beach.",
      "Read it slowly. That's the whole point.",
    ],
    sections: [
      {
        kicker: "Feature",
        title: "The last green flash of summer",
        image: placeSunset,
      },
      {
        kicker: "Field guide",
        title: "Five beaches the locals love",
        image: placeTigertail,
      },
      {
        kicker: "Portfolio",
        title: "Mangroves at first light",
        image: placeMangrove,
      },
      {
        kicker: "Table",
        title: "A farewell to stone crab",
        image: placeMarina,
      },
    ],
    featured: true,
  },
  {
    slug: "taste-of-the-island-05",
    title: "Taste of the Island",
    issue: "Issue 05",
    season: "Spring 2026",
    date: "March 2026",
    pages: 96,
    cover: mag2,
    tagline: "Dock-to-table dispatches from the Gulf.",
    description:
      "Where the boats come in, what the chefs are cooking, and the bars that keep the island going.",
    letter: [
      "A food issue, but really a people issue. Chefs, fishermen, oyster farmers and bartenders — the cast that keeps Marco's kitchens humming.",
    ],
    sections: [
      {
        kicker: "Cover story",
        title: "The new shape of Florida cuisine",
        image: placeMarina,
      },
      {
        kicker: "Profile",
        title: "Captain Maya, dawn to dock",
        image: placeWildlife,
      },
      {
        kicker: "List",
        title: "Twelve cocktails for the heat",
        image: placeSunset,
      },
    ],
  },
  {
    slug: "wild-waters-04",
    title: "Wild Waters",
    issue: "Issue 04",
    season: "Winter 2026",
    date: "December 2025",
    pages: 108,
    cover: mag3,
    tagline: "Estuaries, eagles and the quiet edge of the Gulf.",
    description:
      "A nature-led edition: kayak trails through the Ten Thousand Islands and the people protecting them.",
    letter: [
      "When the snowbirds arrive, the wildlife retreats. This issue is about the second island — the one of mangroves, manatees and morning mist.",
    ],
    sections: [
      {
        kicker: "Expedition",
        title: "Paddling the Ten Thousand",
        image: placeMangrove,
      },
      {
        kicker: "Conservation",
        title: "Inside Rookery Bay",
        image: placeWildlife,
      },
      {
        kicker: "Portfolio",
        title: "A year of ospreys",
        image: placeTigertail,
      },
    ],
  },
  {
    slug: "coastal-escapes-03",
    title: "Coastal Escapes",
    issue: "Issue 03",
    season: "Fall 2025",
    date: "September 2025",
    pages: 88,
    cover: mag1,
    tagline: "The quiet shoulder season, savored properly.",
    description: "When the crowds thin and the island finally exhales.",
    letter: ["The shoulder season is the locals' favorite. Here's why."],
    sections: [
      {
        kicker: "Guide",
        title: "Off-season at Tigertail",
        image: placeTigertail,
      },
    ],
    archived: true,
  },
  {
    slug: "taste-of-the-island-02",
    title: "Taste of the Island",
    issue: "Issue 02",
    season: "Summer 2025",
    date: "June 2025",
    pages: 80,
    cover: mag2,
    tagline: "Sunset dining and the rituals of the dock.",
    description: "The places we returned to all summer.",
    letter: ["A short, hungry tour of the island's most romantic dinners."],
    sections: [
      { kicker: "List", title: "Ten tables for two", image: placeMarina },
    ],
    archived: true,
  },
  {
    slug: "wild-waters-01",
    title: "Wild Waters",
    issue: "Issue 01",
    season: "Spring 2025",
    date: "March 2025",
    pages: 72,
    cover: mag3,
    tagline: "The launch issue. A field guide begins.",
    description: "Where it all started — our first dispatch from the channels.",
    letter: ["Issue one. The publication, taking its first breath."],
    sections: [
      {
        kicker: "Editor's note",
        title: "Why this magazine, now",
        image: placeMangrove,
      },
    ],
    archived: true,
  },
];

export const magazinesBySlug: Record<string, Magazine> = Object.fromEntries(
  magazines.map((m) => [m.slug, m])
);
