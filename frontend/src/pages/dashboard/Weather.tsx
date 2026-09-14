import { useEffect, useState } from "react";
import {
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  ThermometerSun,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---------- Types ----------
interface DailyForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  code: number;
  precipitation: number;
}

interface WeatherData {
  currentTemp: number;
  currentCode: number;
  windSpeed: number;
  humidity: number;
  locationName: string;
  daily: DailyForecast[];
  monthlyAvgTemp: number;
  monthlyRainfall: number;
}

// ---------- Weather code -> icon/label (Open-Meteo WMO codes) ----------
function getWeatherInfo(code: number): { icon: typeof Sun; label: string } {
  if (code === 0) return { icon: Sun, label: "Clear Sky" };
  if (code === 1 || code === 2) return { icon: CloudSun, label: "Partly Cloudy" };
  if (code === 3) return { icon: Cloud, label: "Overcast" };
  if (code === 45 || code === 48) return { icon: CloudFog, label: "Fog" };
  if (code >= 51 && code <= 57) return { icon: CloudRain, label: "Drizzle" };
  if (code >= 61 && code <= 67) return { icon: CloudRain, label: "Rain" };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, label: "Snow" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, label: "Rain Showers" };
  if (code >= 85 && code <= 86) return { icon: CloudSnow, label: "Snow Showers" };
  if (code >= 95) return { icon: CloudLightning, label: "Thunderstorm" };
  return { icon: CloudSun, label: "Partly Cloudy" };
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default fallback location (used if geolocation is denied/unavailable)
const DEFAULT_LAT = 21.1702; // Surat, Gujarat
const DEFAULT_LON = 72.8311;
const DEFAULT_NAME = "Surat, Gujarat";

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
    );
    const json = await res.json();
    if (json?.results?.[0]) {
      const r = json.results[0];
      return [r.name, r.admin1].filter(Boolean).join(", ");
    }
  } catch {
    // ignore, fall back to coordinates
  }
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

async function fetchWeather(lat: number, lon: number): Promise<Omit<WeatherData, "locationName">> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
    `&past_days=14&forecast_days=8&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather service unavailable");
  const json = await res.json();

  const daily: DailyForecast[] = json.daily.time
    .map((dateStr: string, i: number) => ({
      date: dateStr,
      day: DAY_NAMES[new Date(dateStr).getDay()],
      tempMax: Math.round(json.daily.temperature_2m_max[i]),
      tempMin: Math.round(json.daily.temperature_2m_min[i]),
      code: json.daily.weather_code[i],
      precipitation: json.daily.precipitation_probability_max?.[i] ?? 0,
    }))
    // keep only today onward (past_days gave us history for the monthly stats below)
    .filter((d: DailyForecast) => new Date(d.date) >= new Date(new Date().toDateString()))
    .slice(0, 7);

  // Use the trailing 14 "past_days" + today for a rolling "monthly-style" overview,
  // since Open-Meteo's free tier doesn't do true calendar-month aggregates.
  const pastCount = 14;
  const pastMaxTemps: number[] = json.daily.temperature_2m_max.slice(0, pastCount);
  const pastMinTemps: number[] = json.daily.temperature_2m_min.slice(0, pastCount);
  const pastRain: number[] = json.daily.precipitation_sum.slice(0, pastCount);

  const avgTemp =
    pastMaxTemps.reduce((a: number, b: number, i: number) => a + (b + pastMinTemps[i]) / 2, 0) /
    pastMaxTemps.length;
  const totalRain = pastRain.reduce((a: number, b: number) => a + b, 0);

  return {
    currentTemp: Math.round(json.current.temperature_2m),
    currentCode: json.current.weather_code,
    windSpeed: Math.round(json.current.wind_speed_10m),
    humidity: Math.round(json.current.relative_humidity_2m),
    daily,
    monthlyAvgTemp: Math.round(avgTemp),
    monthlyRainfall: Math.round(totalRain),
  };
}

function getLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON }),
      { timeout: 6000 }
    );
  });
}

// ---------- Advisory generated from real data instead of hardcoded text ----------
function buildAdvisories(data: WeatherData) {
  const advisories: { title: string; text: string; tone: "green" | "yellow" | "red" }[] = [];

  const rainyDay = data.daily.find((d) => d.precipitation >= 50);
  if (rainyDay) {
    advisories.push({
      title: "Weather Alert",
      text: `${rainyDay.precipitation}% chance of rain on ${rainyDay.day}. Plan irrigation and harvesting around it.`,
      tone: "yellow",
    });
  } else {
    advisories.push({
      title: "No Significant Rain Expected",
      text: "Little to no rain forecast over the next 7 days — irrigation scheduling is under your control.",
      tone: "green",
    });
  }

  if (data.currentTemp >= 35) {
    advisories.push({
      title: "Heat Advisory",
      text: `Current temperature is ${data.currentTemp}°C. Water crops early morning or evening to reduce evaporation loss.`,
      tone: "red",
    });
  } else if (data.currentTemp <= 10) {
    advisories.push({
      title: "Cold Advisory",
      text: `Current temperature is ${data.currentTemp}°C. Watch for frost risk on sensitive crops overnight.`,
      tone: "red",
    });
  } else {
    advisories.push({
      title: "Optimal Conditions",
      text: `Current conditions (${data.currentTemp}°C, ${data.humidity}% humidity) are within a normal range for most crops.`,
      tone: "green",
    });
  }

  if (data.humidity >= 80) {
    advisories.push({
      title: "High Humidity",
      text: `Humidity is at ${data.humidity}%. Monitor for fungal disease risk in dense canopy crops.`,
      tone: "yellow",
    });
  }

  return advisories;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Weather Forecast - AgriSmart";

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { lat, lon } = await getLocation();
        const [weatherPart, locationName] = await Promise.all([
          fetchWeather(lat, lon),
          reverseGeocode(lat, lon),
        ]);
        if (!cancelled) {
          setWeather({ ...weatherPart, locationName: locationName || DEFAULT_NAME });
        }
      } catch (e) {
        if (!cancelled) setError("Couldn't load live weather data. Please try again shortly.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Refresh every 15 minutes so the page stays live if left open
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-agri-50 to-agri-100/40">
        <div className="flex flex-col items-center gap-3 text-agri-700">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Fetching live weather for your location…</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-agri-50 to-agri-100/40 p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <p className="text-gray-700">{error || "Something went wrong."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentIcon = getWeatherInfo(weather.currentCode).icon;
  const currentLabel = getWeatherInfo(weather.currentCode).label;
  const advisories = buildAdvisories(weather);

  const toneStyles: Record<string, { bg: string; text: string }> = {
    green: { bg: "bg-green-50", text: "text-green-800" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-800" },
    red: { bg: "bg-red-50", text: "text-red-800" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-50 to-agri-100/40 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-agri-800">Weather Forecast</h1>
        <p className="text-gray-600">Live 7-day weather forecast for {weather.locationName}</p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-agri-100 to-agri-200 border-agri-200">
        <CardHeader>
          <CardTitle className="text-agri-800">Today's Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-agri-100 rounded-full">
                <CurrentIcon className="h-8 w-8 text-agri-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weather.currentTemp}°C</p>
                <p className="text-sm text-gray-600">{currentLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-agri-100 rounded-full">
                <Wind className="h-8 w-8 text-agri-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-agri-100 rounded-full">
                <Droplets className="h-8 w-8 text-agri-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weather.daily.map((forecast, idx) => {
          const info = getWeatherInfo(forecast.code);
          const Icon = info.icon;
          return (
            <Card
              key={forecast.date}
              className={`bg-gradient-to-br ${idx % 2 === 0 ? "from-agri-50 to-agri-100" : "from-agri-100 to-agri-200"}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {idx === 0 ? "Today" : forecast.day}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {forecast.tempMax}° / {forecast.tempMin}°C
                </div>
                <div className="text-sm text-gray-600">{info.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Precipitation: {forecast.precipitation}%
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agriculture Advisory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advisories.map((a) => (
                <div
                  key={a.title}
                  className={`flex items-start gap-3 p-4 rounded-lg ${toneStyles[a.tone].bg}`}
                >
                  <ThermometerSun className={`h-5 w-5 mt-1 ${toneStyles[a.tone].text}`} />
                  <div>
                    <p className={`font-medium ${toneStyles[a.tone].text}`}>{a.title}</p>
                    <p className="text-sm text-gray-600">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last 14 Days Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-agri-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg. Temperature</p>
                  <p className="text-2xl font-bold text-agri-700">{weather.monthlyAvgTemp}°C</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Rainfall</p>
                  <p className="text-2xl font-bold text-green-700">{weather.monthlyRainfall}mm</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Based on live data for {weather.locationName} over the last 14 days, updating
                automatically as new readings come in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
