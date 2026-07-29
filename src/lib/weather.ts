const LATITUDE = 25.9419;
const LONGITUDE = -81.7284;

const WEATHER_CODES: Record<number, string> = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Snow",
  73: "Snow",
  75: "Heavy Snow",
  80: "Rain Showers",
  81: "Rain Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
};

export async function getMarcoWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LATITUDE}` +
    `&longitude=${LONGITUDE}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,uv_index` +
    `&daily=sunrise,sunset,uv_index_max` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=America/New_York`;

  const res = await fetch(url, {
    next: {
      revalidate: 1800, // 30 minutes
    },
  });

  if (!res.ok) {
    throw new Error("Unable to fetch weather");
  }

  const data = await res.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: WEATHER_CODES[data.current.weather_code] ?? "Unknown",
    wind: Math.round(data.current.wind_speed_10m),
    humidity: Math.round(data.current.relative_humidity_2m),
    uvIndex: Math.round(data.current.uv_index),
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}
