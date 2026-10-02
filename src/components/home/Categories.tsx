import Link from "next/link";
import { GetAllPlacesApi } from "@/api/users/places.api";
import type { ApiPlace } from "@/types/place";

// TODO: the places API does not return `placesCount`, so the count label renders empty
type CategoryPlace = ApiPlace & { placesCount?: number };

export async function Categories() {
  const res = await GetAllPlacesApi();
  const categories: CategoryPlace[] = res?.data?.data?.places ?? [];
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
          {categories.map((category) => (
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