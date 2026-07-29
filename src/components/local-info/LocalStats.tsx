import { getMarcoWeather } from "@/lib/weather";
import { formatTime } from "@/lib/date";
import { MARCO_ISLAND_FACTS } from "@/lib/island-facts";

export async function LocalStats() {
  const weather = await getMarcoWeather();

  const marcoTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  }).format(new Date());

  const liveStats = [
    { k: "Current Temperature", v: `${weather.temperature}°F` },
    { k: "Feels Like", v: `${weather.feelsLike}°F` },
    { k: "Today's Weather", v: weather.condition },
    { k: "Wind", v: `${weather.wind} mph` },
    { k: "Humidity", v: `${weather.humidity}%` },
    { k: "Local Time", v: marcoTime },
    { k: "Sunrise", v: formatTime(weather.sunrise) },
    { k: "Sunset", v: formatTime(weather.sunset) },
  ];

  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-5 py-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {liveStats.map((stat) => (
            <div key={stat.k}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.k}
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-[#002E50] md:text-2xl">
                {stat.v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-6 lg:grid-cols-4">
          {MARCO_ISLAND_FACTS.map((fact) => (
            <div key={fact.k}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {fact.k}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-[#002E50] md:text-xl">
                {fact.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
