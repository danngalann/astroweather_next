import { API_URL } from '@/app/lib/constants'
import { WeatherData } from '@/app/lib/definitions'
import { formatWeatherIconUrl, getLocationQualityStyles } from '@/app/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const res = await fetch(`${API_URL}/weather`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = (await res.json()) as WeatherData[]

  return (
    <main className="min-h-screen bg-zinc-900 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-zinc-100">
        AstroWeather
      </h1>
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {data.map(({ location, current, forecast }) => (
          <div
            key={location.slug}
            className={`relative w-full max-w-md rounded-xl border-2 bg-zinc-800 p-6 shadow-lg transition-all ${getLocationQualityStyles(location.isGoodPlaceTonight)}`}
          >
            {location.isGoodPlaceTonight && (
              <span className="absolute top-4 right-4 rounded bg-green-700 px-2 py-1 text-xs font-bold text-zinc-100 shadow">
                Good Place Tonight
              </span>
            )}
            <div className="mb-4">
              <h2 className="mb-1 text-xl font-semibold text-zinc-100">
                {location.name}
              </h2>
              <p className="text-sm text-zinc-400">
                {location.region}, {location.country}
              </p>
              <p className="text-xs text-zinc-500">Bortle: {location.bortle}</p>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <Image
                src={formatWeatherIconUrl(current.condition.icon)}
                width={48}
                height={48}
                alt={current.condition.text}
                className="h-12 w-12"
              />
              <div>
                <div className="text-2xl font-bold text-zinc-100">
                  {current.temp_c}°C
                </div>
                <div className="text-zinc-300">{current.condition.text}</div>
                <div className="text-xs text-zinc-500">
                  Humidity: {current.humidity}% | Wind: {current.wind_kph} kph
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-zinc-200">Forecast:</span>
            </div>
            <div className="space-y-2">
              {forecast.forecastday.map((day) => {
                return (
                  <div
                    key={day.date}
                    className="flex items-center gap-3 rounded bg-zinc-700 p-2"
                  >
                    <Image
                      src={formatWeatherIconUrl(day.day.condition.icon)}
                      alt={day.day.condition.text}
                      width={48}
                      height={48}
                      className="h-8 w-8"
                    />
                    <div>
                      <div className="text-sm font-medium text-zinc-100">
                        {new Date(day.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-zinc-300">
                        {day.day.condition.text}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C |{' '}
                        Humidity: {day.day.avghumidity}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link
              href={`/${location.slug}/detail`}
              className="mt-4 block rounded bg-blue-600 py-2 text-center text-sm font-medium text-zinc-100 transition-colors hover:bg-blue-700"
            >
              View Hourly Forecast
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
