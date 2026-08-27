import { GetAllBusinessApi, GetBusinessCategoryApi } from "@/api/users/business.api";
import Image from "next/image";
import Link from "next/link";
import { categories as fallbackCategories } from "@/data/content";
import { GetAllPlacesApi } from "@/api/users/places.api";
type ApiCategory = {
  id?: string | number;
  name?: string;
  title?: string;
  category_name?: string;
  slug?: string;
  image?: string;
  count?: number;
  business_count?: number;
  total?: number;
};
type DisplayCategory = {
  slug: string;
  name: string;
  image: string;
  placesCount: number;
};
function mapApiCategory(category: ApiCategory): DisplayCategory | null {
  const name = category.name || category.title || category.category_name || "";
  if (!name) return null;
  const slug = category.slug || name.toLowerCase().replace(/\s+/g, "-");
  const fallback = fallbackCategories.find((c) => c.slug === slug);
  return {
    slug,
    name,
    image: category.image || fallback?.image || "/assets/cat-services.jpg",
    placesCount: category.count ?? category.business_count ?? category.total ?? 0,
  };
}
export async function Categories() {
  const res = await GetAllPlacesApi();
  const responseData = res?.data?.data?.places
  console.log(responseData, "responseData")
  const categories = responseData
  console.log(categories, "categoriesbbb")
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section intro */}
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary/60">
            Browse the island
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl md:text-5xl">
          Top Places to Visit on Marco Island
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            Find places worth knowing, from stays and dining to shopping,
            experiences, and local favorites.
          </p>
        </div>
        {/* Categories */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category:any) => (
            <Link
              key={category.slug}
              href={`/places/${category.slug}`}

              className="group relative aspect-[16/9] overflow-hidden rounded-2xl"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.featured_image}`}
                alt={category.name}
                // fill
                // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Simple gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-gold">
                  {category.placesCount} places
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-primary-foreground sm:text-xl">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}