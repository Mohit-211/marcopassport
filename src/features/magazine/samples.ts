import { contentsEntries } from "./renderer/spreads";
import type { LayoutId, MagPage } from "./renderer/types";
import { letterOf, type MagazineIssue } from "./model";

/**
 * Sample issues that ship with the site. The magazine shows them only while
 * the API has no published issue (see ./shelf.ts), so the section never sits
 * empty. They're built from the admin builder's own layouts and the site's
 * photos, so they read exactly like a real issue.
 */

const photo = (name: string, focusY = 50) => ({ src: `/assets/${name}`, focusX: 50, focusY });

type SampleDetails = Omit<MagazineIssue, "pages" | "contents" | "letter" | "sample">;

function sample(details: SampleDetails, pages: [LayoutId, Record<string, unknown>][]): MagazineIssue {
  const built: MagPage[] = pages.map(([layout, content], i) => ({ id: `${details.slug}-${i + 1}`, layout, content }));
  return { ...details, pages: built, contents: contentsEntries(built), letter: letterOf(built), sample: true };
}

const coastalEscapes = sample(
  {
    slug: "coastal-escapes-06",
    title: "Coastal Escapes",
    masthead: "Marco",
    issueLabel: "Issue 06",
    season: "Summer 2026",
    publishDate: "2026-06-01",
    tagline: "A slow guide to a long Florida summer.",
    description: "The summer edition: sun-drenched dispatches, hidden coves, and the slow art of doing nothing well.",
    featured: true,
  },
  [
    [
      "cover",
      {
        image: photo("place-sunset.jpg", 60),
        headline: "The last green flash of summer",
        dek: "Chasing the island's most elusive sunset",
        lines: "Five beaches the locals love\nMangroves at first light\nA farewell to stone crab",
        text: "light",
      },
    ],
    [
      "contents",
      {
        headline: "In this issue",
        intro: "Beaches, boats and the slow art of doing nothing well: a summer issue for the long days.",
        image: photo("place-marina.jpg"),
      },
    ],
    [
      "letter",
      {
        kicker: "From the editor",
        headline: "Made for the long days",
        body:
          "We made this issue for the long days. The ones that begin with coffee on the dock and end with bare feet on warm sand. Marco Island in summer is a different animal: slower, brighter, more generous with its hours.\n\nInside, you'll find a field guide to the island's quietest beaches, a love letter to stone crab season's last week, and a portfolio from photographer Anya Reyes, who spent a month chasing the green flash from South Beach.\n\nRead it slowly. That's the whole point.",
        signature_name: "Anna Reyes",
        signature_role: "Editor",
      },
    ],
    [
      "feature",
      {
        image: photo("hero-marco-island.jpg", 55),
        kicker: "Feature",
        headline: "The last green flash of summer",
        dek: "Photographer Anya Reyes spent a month on South Beach, waiting for a sunset that lasts half a second.",
        byline: "Words by Lena Ortiz · Photos by Anya Reyes",
        position: "bottom",
        credit: "Anya Reyes",
      },
    ],
    [
      "article",
      {
        kicker: "Feature",
        headline: "Thirty sunsets, one flash",
        dek: "What it takes to catch the Gulf's rarest light.",
        byline: "Words by Lena Ortiz",
        image_position: "top",
        image: photo("place-cruise.jpg"),
        caption: "Boats heading in as the sun drops behind the Gulf.",
        body:
          "Every evening for a month, Anya Reyes set her tripod in the same patch of sand on South Beach and waited. The green flash, a thin emerald blink as the sun slips under a clean horizon, needs perfect air: no haze, no cloud bank, no distant squall.\n\nMost nights the sun simply melted into a band of orange. Some nights it vanished behind clouds that hadn't been there an hour before. Locals walking their dogs started bringing her coffee.\n\n## The night it happened\n\nOn the twenty-eighth evening the air was glass. The sun touched the water, flattened, and in its last sliver turned the colour of a lime. Reyes shot eleven frames. Two of them are in this issue.\n\n*\"You don't really see it,\"* she says. *\"You see that you saw it.\"*",
        pull_quote: "You don't really see it. You see that you saw it.",
        drop_cap: true,
        hide_from_contents: true,
      },
    ],
    [
      "guide",
      {
        kicker: "Field guide",
        headline: "Five beaches the locals love",
        intro: "Where to spread a towel when the crowds are on the main beach.",
        items: [
          {
            name: "Tigertail Beach",
            text: "A tidal lagoon, a sandbar called Sand Dollar Island, and some of the best shelling on the island.",
            details: "Hernando Dr · parking fee",
            link: "/explore/tigertail-beach",
            image: photo("place-tigertail.jpg"),
          },
          {
            name: "South Beach",
            text: "Wide, soft sand on the island's southern tip, and the best seat in town for sunset.",
            details: "County Rd 953 · public access",
            link: "/explore/south-beach",
            image: photo("place-sunset.jpg"),
          },
          {
            name: "Caxambas Park",
            text: "A boat ramp and a quiet strip of shore where the island meets the Ten Thousand Islands.",
            details: "Caxambas Ct · open daily",
            image: photo("place-caxambas.jpg"),
          },
        ],
      },
    ],
    [
      "photo",
      {
        image: photo("place-mangrove.jpg"),
        headline: "Mangroves at first light",
        caption: "A dawn paddle through the Ten Thousand Islands, before the wind picks up.",
        credit: "Anya Reyes",
      },
    ],
    [
      "gallery",
      {
        kicker: "Portfolio",
        headline: "Summer, in four frames",
        photos: [
          { image: photo("place-wildlife.jpg"), caption: "An osprey over Collier Bay." },
          { image: photo("place-marina.jpg"), caption: "The marina at golden hour." },
          { image: photo("yacht.jpg"), caption: "Out past the channel markers." },
          { image: photo("pier-pic.jpg"), caption: "The last light on the pier." },
        ],
        credit: "Anya Reyes",
      },
    ],
    [
      "quote",
      {
        quote: "The island gives you exactly as much as you slow down for.",
        attribution: "Captain Maya Torres",
        background: "navy",
      },
    ],
    [
      "article",
      {
        kicker: "Table",
        headline: "A farewell to stone crab",
        dek: "The season's last week, at the counters that wait all year for it.",
        byline: "Words by Sam Whitfield",
        image_position: "top",
        image: photo("restaurant.jpg"),
        caption: "Claws, cracked and chilled, with a mustard sauce that's older than the dock.",
        body:
          "Stone crab season ends in May, and on Marco Island the last week has the feel of a send-off. Counters that serve them all winter put out their final trays, and regulars order one more round than they meant to.\n\nOnly the claws are taken. The crab goes back into the water and grows them again, which is part of why the season feels like a promise rather than a harvest.\n\n## How to order\n\nAsk for mediums if you want value and jumbos if you want a story. Eat them cold, with the mustard sauce, and don't skip the key lime pie.",
        pull_quote: "The crab goes back into the water and grows them again.",
        drop_cap: true,
      },
    ],
    ["ad_half", { ads: [] }],
    ["back", { image: photo("place-sunset.jpg", 65), headline: "Until next issue", text: "themarcopassport.com" }],
  ],
);

const tasteOfTheIsland = sample(
  {
    slug: "taste-of-the-island-05",
    title: "Taste of the Island",
    masthead: "Marco",
    issueLabel: "Issue 05",
    season: "Spring 2026",
    publishDate: "2026-03-01",
    tagline: "Dock-to-table dispatches from the Gulf.",
    description: "The spring edition: the people who catch, cook and pour on Marco Island, and where to find them.",
    featured: false,
  },
  [
    [
      "cover",
      {
        image: photo("restaurant.jpg"),
        headline: "The new shape of Florida cuisine",
        dek: "From the boat to the table, in an afternoon",
        lines: "Captain Maya, dawn to dock\nTwelve cocktails for the heat",
        text: "light",
      },
    ],
    ["contents", { headline: "In this issue", intro: "A spring issue about food: who catches it, who cooks it, and where to eat it." }],
    [
      "letter",
      {
        kicker: "From the editor",
        headline: "Dinner starts at dawn",
        body:
          "Most of what's on a Marco Island plate was in the Gulf this morning. This issue follows it there: out with the boats before sunrise, back through the kitchens, and onto the table.\n\nWe spent the spring eating our way around the island so you don't have to guess. You'll still want to, though.",
        signature_name: "Anna Reyes",
        signature_role: "Editor",
      },
    ],
    [
      "feature",
      {
        image: photo("cat-eat.jpg"),
        kicker: "Cover story",
        headline: "The new shape of Florida cuisine",
        dek: "Island kitchens are cooking with what the Gulf brings in, and changing the menu daily.",
        byline: "Words by Sam Whitfield",
        position: "bottom",
      },
    ],
    [
      "article",
      {
        kicker: "Profile",
        headline: "Captain Maya, dawn to dock",
        dek: "A day aboard with one of the island's working captains.",
        byline: "Words by Lena Ortiz",
        image_position: "side",
        image: photo("pier-pic.jpg"),
        caption: "Back at the dock by noon, the catch already spoken for.",
        body:
          "Captain Maya Torres leaves the dock at five, before the first coffee shop opens. By seven she's forty minutes out, reading the water for birds.\n\nBy noon she's back, and by evening what she caught is on three menus in town. *\"People think the job is fishing,\"* she says. *\"The job is knowing who's cooking tonight.\"*",
        pull_quote: "The job is knowing who's cooking tonight.",
        drop_cap: true,
      },
    ],
    [
      "guide",
      {
        kicker: "Field guide",
        headline: "Where to eat on the water",
        intro: "Three kinds of waterfront meal, and when to go for each.",
        items: [
          {
            name: "A raw bar on the marina",
            text: "Oysters, shrimp and a cold drink while the boats come in.",
            details: "Best at 5 pm, before the sunset rush",
            image: photo("cat-eat.jpg"),
          },
          {
            name: "A dinner deck facing west",
            text: "Book the table on the rail and order whatever the boats brought in.",
            details: "Reserve for sunset",
            image: photo("restaurant.jpg"),
          },
          {
            name: "Lunch at the dock",
            text: "Grouper sandwiches, eaten with your feet over the water.",
            details: "Cash is welcome · no reservations",
            image: photo("place-marina.jpg"),
          },
        ],
      },
    ],
    [
      "gallery",
      {
        kicker: "On the table",
        headline: "A season of plates",
        photos: [
          { image: photo("blog-1.jpg"), caption: "Breakfast on the water." },
          { image: photo("blog-2.jpg"), caption: "Lunch, straight off the boat." },
          { image: photo("blog-3.jpg"), caption: "Sunset, with something cold." },
        ],
      },
    ],
    ["quote", { quote: "If it swam this morning, it's on the menu tonight.", attribution: "A chalkboard on the waterfront", background: "cream" }],
    ["ad_half", { ads: [] }],
    ["back", { image: photo("place-marina.jpg"), headline: "Until next issue", text: "themarcopassport.com" }],
  ],
);

const wildWaters = sample(
  {
    slug: "wild-waters-04",
    title: "Wild Waters",
    masthead: "Marco",
    issueLabel: "Issue 04",
    season: "Winter 2026",
    publishDate: "2026-01-01",
    tagline: "Estuaries, eagles and the quiet edge of the Gulf.",
    description: "The winter edition: the wild side of Marco Island, from the mangrove tunnels to the rookeries.",
    featured: false,
  },
  [
    [
      "cover",
      {
        image: photo("place-mangrove.jpg"),
        headline: "Paddling the Ten Thousand",
        dek: "Three days in the mangroves",
        lines: "Inside Rookery Bay\nA year of ospreys",
        text: "light",
      },
    ],
    ["contents", { headline: "In this issue", intro: "Winter is when the wild side of the island is easiest to see." }],
    [
      "letter",
      {
        kicker: "From the editor",
        headline: "The quiet season",
        body:
          "Winter thins the boat traffic and fills the sky with birds. It's the best time of year to see how much of Marco Island is still wild.\n\nThis issue goes looking: into the mangrove tunnels, out to the rookeries, and up close with the ospreys that nest on every tall thing they can find.",
        signature_name: "Anna Reyes",
        signature_role: "Editor",
      },
    ],
    [
      "feature",
      {
        image: photo("place-wildlife.jpg"),
        kicker: "Expedition",
        headline: "Paddling the Ten Thousand",
        dek: "Three days, two kayaks and a map that's mostly water.",
        byline: "Words and photos by Anya Reyes",
        position: "bottom",
      },
    ],
    [
      "text",
      {
        kicker: "Paddling the Ten Thousand",
        body:
          "The Ten Thousand Islands start where Marco Island ends: a maze of mangrove keys that runs down toward the Everglades. From a kayak, the channels look like hallways, and every turn opens onto another.\n\nWe saw dolphins on the first morning and no other people until the third. The silence is the first thing you notice and the last thing you forget.",
        pull_quote: "The silence is the first thing you notice and the last thing you forget.",
        image: photo("place-mangrove.jpg"),
        caption: "A mangrove tunnel, an hour into the first day.",
      },
    ],
    [
      "photo",
      {
        image: photo("place-wildlife.jpg"),
        headline: "A year of ospreys",
        caption: "The island's ospreys nest on channel markers, light poles and anything else tall enough.",
        credit: "Anya Reyes",
      },
    ],
    [
      "gallery",
      {
        kicker: "Portfolio",
        headline: "Winter wings",
        photos: [
          { image: photo("place-wildlife.jpg"), caption: "An osprey on the hunt." },
          { image: photo("place-tigertail.jpg"), caption: "Wading birds on the Tigertail lagoon." },
          { image: photo("place-caxambas.jpg"), caption: "Pelicans at Caxambas Pass." },
          { image: photo("place-mangrove.jpg"), caption: "Herons in the mangroves at dusk." },
        ],
        credit: "Anya Reyes",
      },
    ],
    ["quote", { quote: "Look up. Something on this island is always watching the water.", attribution: "Rookery Bay volunteer", background: "photo", image: photo("place-caxambas.jpg") }],
    ["ad_half", { ads: [] }],
    ["back", { image: photo("place-mangrove.jpg"), headline: "Until next issue", text: "themarcopassport.com" }],
  ],
);

/** Newest first, like the API. */
export const SAMPLE_ISSUES: MagazineIssue[] = [coastalEscapes, tasteOfTheIsland, wildWaters];
