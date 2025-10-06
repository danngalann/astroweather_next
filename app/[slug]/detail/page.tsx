import { API_URL } from '@/app/lib/constants'
import { WeatherData } from '@/app/lib/definitions'
import { isDaytime } from '@/app/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface DetailPageProps {
  params: {
    slug: string
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = params

  const res = await fetch(`${API_URL}/weather/${slug}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = (await res.json()) as WeatherData
  const { location, current, forecast } = data

  return (
    <main className="min-h-screen bg-zinc-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-200"
        >
          ← Back to overview
        </Link>

        <div
          className={`mb-8 rounded-xl border-2 bg-zinc-800 p-6 shadow-lg ${location.isGoodPlaceTonight ? 'border-blue-400 ring-2 ring-blue-700' : 'border-zinc-700'}`}
        >
          {location.isGoodPlaceTonight && (
            <span className="absolute top-4 right-4 rounded bg-blue-700 px-2 py-1 text-xs font-bold text-zinc-100 shadow">
              Good Place Tonight
            </span>
          )}
          <div className="mb-4">
            <h1 className="mb-1 text-3xl font-bold text-zinc-100">
              {location.name}
            </h1>
            <p className="text-sm text-zinc-400">
              {location.region}, {location.country}
            </p>
            <p className="text-xs text-zinc-500">Bortle: {location.bortle}</p>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src={
                current.condition.icon.startsWith('//')
                  ? `http:${current.condition.icon}`
                  : current.condition.icon
              }
              width={64}
              height={64}
              alt={current.condition.text}
              className="h-16 w-16"
            />
            <div>
              <div className="text-3xl font-bold text-zinc-100">
                {current.temp_c}°C
              </div>
              <div className="text-zinc-300">{current.condition.text}</div>
              <div className="text-sm text-zinc-500">
                Humidity: {current.humidity}% | Wind: {current.wind_kph} kph |
                UV: {current.uv}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {forecast.forecastday.map((day) => (
            <div
              key={day.date}
              className="rounded-xl bg-zinc-800 p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between border-b border-zinc-700 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    {new Date(day.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {day.day.condition.text}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">
                    {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C
                  </div>
                  <div className="text-xs text-zinc-500">
                    Sunrise: {day.astro.sunrise} | Sunset: {day.astro.sunset}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Moon: {day.astro.moon_phase} ({day.astro.moon_illumination}
                    %)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {day.hour.map((hour) => {
                  const isDay = isDaytime(
                    hour.time,
                    day.astro.sunrise,
                    day.astro.sunset,
                  )

                  return (
                    <div
                      key={hour.time}
                      className={`rounded-lg border p-3 transition-colors ${
                        isDay
                          ? 'border-yellow-600/50 bg-yellow-800/20'
                          : 'border-zinc-700 bg-zinc-700/50'
                      }`}
                    >
                      <div className="mb-2 text-center text-xs font-medium text-zinc-300">
                        {new Date(hour.time).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="mb-2 flex justify-center">
                        <Image
                          src={
                            hour.condition.icon.startsWith('//')
                              ? `http:${hour.condition.icon}`
                              : hour.condition.icon
                          }
                          alt={hour.condition.text}
                          width={48}
                          height={48}
                          className="h-12 w-12"
                        />
                      </div>
                      <div className="text-center text-lg font-bold text-zinc-100">
                        {Math.round(hour.temp_c)}°C
                      </div>
                      <div className="text-center text-xs text-zinc-400">
                        {hour.condition.text}
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-zinc-500">
                        <div>💧 {hour.humidity}%</div>
                        <div>💨 {Math.round(hour.wind_kph)} kph</div>
                        <div>☁️ {hour.cloud}%</div>
                        {hour.chance_of_rain > 0 && (
                          <div className="text-blue-400">
                            🌧️ {hour.chance_of_rain}%
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
