import { API_URL } from '@/app/lib/constants'
import { WeatherData } from '@/app/lib/definitions'
import {
  isDaytime,
  formatWeatherIconUrl,
  getLocationQualityStyles,
  getCloudCoverQuality,
  getCloudCoverStyles,
  getMoonIlluminationStyles,
  getHourlyCloudStyles,
  getDayNightStyles,
} from '@/app/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface DetailPageProps {
  params: {
    slug: string
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params

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
          className={`mb-8 rounded-xl border-2 bg-zinc-800 p-6 shadow-lg ${getLocationQualityStyles(location.isGoodPlaceTonight)}`}
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
              src={formatWeatherIconUrl(current.condition.icon)}
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
            const nightHours = day.hour.filter(
              (h) => !isDaytime(h.time, day.astro.sunrise, day.astro.sunset),
            )
            const avgCloudCover =
              nightHours.length > 0
                ? Math.round(
                    nightHours.reduce((sum, h) => sum + h.cloud, 0) /
                      nightHours.length,
                  )
                : 0
            const moonIllumination = day.astro.moon_illumination

            return (
              <div
                key={day.date}
                className="rounded-xl bg-zinc-800 p-6 shadow-lg"
              >
                <div className="mb-4 border-b border-zinc-700 pb-4">
                  <div className="mb-3 flex flex-col items-start justify-between sm:flex-row">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100 capitalize">
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
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div
                      className={`rounded-lg border-2 p-3 ${getCloudCoverStyles(avgCloudCover)}`}
                    >
                      <div className="mb-1 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                        Avg Cloud Cover{' '}
                        <span className="text-[10px] text-zinc-500 lowercase">
                          (while the sun is down)
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-zinc-100">
                          {avgCloudCover}%
                        </span>
                        <span className="text-sm text-zinc-400">
                          {getCloudCoverQuality(avgCloudCover).emoji}{' '}
                          {getCloudCoverQuality(avgCloudCover).label}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`rounded-lg border-2 p-3 ${getMoonIlluminationStyles(moonIllumination)}`}
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
                        className={`rounded-lg border-2 p-3 transition-colors ${getDayNightStyles(isDay)}`}
                      >
                        <div className="mb-2 text-center text-sm font-medium text-zinc-300">
                          {new Date(hour.time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>

                        {/* Cloud Cover - Most Important */}
                        <div
                          className={`mb-2 rounded p-2 text-center ${getHourlyCloudStyles(hour.cloud)}`}
                        >
                          <div className="text-xs text-zinc-400">Cloud</div>
                          <div className="text-2xl font-bold text-zinc-100">
                            {hour.cloud}%
                          </div>
                        </div>

                        <div className="mb-2 flex justify-center">
                          <Image
                            src={formatWeatherIconUrl(hour.condition.icon)}
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
