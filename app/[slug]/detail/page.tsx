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
          className={`mb-8 rounded-xl border-2 bg-zinc-800 p-6 shadow-lg ${location.isGoodPlaceTonight ? 'border-green-400 ring-2 ring-green-700' : 'border-zinc-700'}`}
        >
          {location.isGoodPlaceTonight && (
            <span className="absolute top-4 right-4 rounded bg-green-700 px-2 py-1 text-xs font-bold text-zinc-100 shadow">
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
          {forecast.forecastday.map((day) => {
            const avgCloudCover = Math.round(
              day.hour.reduce((sum, h) => sum + h.cloud, 0) / day.hour.length,
            )
            const moonIllumination = day.astro.moon_illumination

            return (
              <div
                key={day.date}
                className="rounded-xl bg-zinc-800 p-6 shadow-lg"
              >
                <div className="mb-4 border-b border-zinc-700 pb-4">
                  <div className="mb-3 flex items-start justify-between">
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
                      <p className="mt-1 text-xs text-zinc-500">
                        {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C
                      </p>
                    </div>
                    <div className="text-xs text-zinc-500">
                      <div>Sunrise: {day.astro.sunrise}</div>
                      <div>Sunset: {day.astro.sunset}</div>
                      <div>Moonrise: {day.astro.moonrise}</div>
                      <div>Moonset: {day.astro.moonset}</div>
                    </div>
                  </div>

                  {/* Astrophotography Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`rounded-lg border-2 p-3 ${
                        avgCloudCover < 30
                          ? 'border-green-500 bg-green-500/10'
                          : avgCloudCover < 60
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-red-500 bg-red-500/10'
                      }`}
                    >
                      <div className="mb-1 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                        Avg Cloud Cover
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-zinc-100">
                          {avgCloudCover}%
                        </span>
                        <span className="text-sm text-zinc-400">
                          {avgCloudCover < 30
                            ? '✨ Excellent'
                            : avgCloudCover < 60
                              ? '⚠️ Moderate'
                              : '❌ Poor'}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`rounded-lg border-2 p-3 ${
                        moonIllumination < 25
                          ? 'border-green-500 bg-green-500/10'
                          : moonIllumination < 50
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-orange-500 bg-orange-500/10'
                      }`}
                    >
                      <div className="mb-1 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                        Moon Illumination
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-zinc-100">
                          {moonIllumination}%
                        </span>
                        <span className="text-sm text-zinc-400">
                          {day.astro.moon_phase}
                        </span>
                      </div>
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
                        className={`rounded-lg border-2 p-3 transition-colors ${
                          isDay
                            ? 'border-yellow-600/50 bg-yellow-900/20'
                            : 'border-zinc-700 bg-zinc-900/50'
                        }`}
                      >
                        <div className="mb-2 text-center text-xs font-medium text-zinc-300">
                          {new Date(hour.time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>

                        {/* Cloud Cover - Most Important */}
                        <div
                          className={`mb-2 rounded p-2 text-center ${
                            hour.cloud < 30
                              ? 'bg-green-500/20'
                              : hour.cloud < 60
                                ? 'bg-yellow-500/20'
                                : 'bg-red-500/20'
                          }`}
                        >
                          <div className="text-xs text-zinc-400">Cloud</div>
                          <div className="text-2xl font-bold text-zinc-100">
                            {hour.cloud}%
                          </div>
                        </div>

                        <div className="mb-2 flex justify-center">
                          <Image
                            src={
                              hour.condition.icon.startsWith('//')
                                ? `http:${hour.condition.icon}`
                                : hour.condition.icon
                            }
                            alt={hour.condition.text}
                            width={40}
                            height={40}
                            className="h-10 w-10"
                          />
                        </div>

                        <div className="text-center text-xs text-zinc-400">
                          {hour.condition.text}
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-zinc-500">
                          <div>🌡️ {Math.round(hour.temp_c)}°C</div>
                          <div>💧 {hour.humidity}%</div>
                          <div>💨 {Math.round(hour.wind_kph)} kph</div>
                          {hour.chance_of_rain > 0 && (
                            <div>🌧️ {hour.chance_of_rain}%</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
