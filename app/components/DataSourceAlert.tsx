import { WeatherData } from '@/app/lib/definitions'
import { getMeteosatCoverage } from '@/app/lib/utils'

export default function DataSourceAlert({ data }: { data: WeatherData[] }) {
  const affected = data
    .map(getMeteosatCoverage)
    .filter((coverage) => coverage.status !== 'ok')

  if (affected.length === 0) return null

  const allMissing =
    affected.length === data.length &&
    affected.every((coverage) => coverage.status === 'missing')

  return (
    <div
      role="alert"
      className="mx-auto mb-6 max-w-3xl rounded-lg border-2 border-red-500 bg-red-950/60 px-4 py-3 text-sm text-red-100"
    >
      <p className="font-bold">
        ⚠️ Meteosat data is {allMissing ? 'missing' : 'stale or incomplete'}
      </p>
      <p className="mt-1">
        {allMissing
          ? 'No forecast hour matched Meteosat for any location. '
          : 'Some locations have little or no Meteosat data. '}
        Values shown come from WeatherAPI only and may be less accurate. The
        Meteosat scraper may be broken or the cache outdated; check it.
      </p>
      {!allMissing && (
        <ul className="mt-2 list-disc pl-5 text-xs text-red-200">
          {affected.map((coverage) => (
            <li key={coverage.slug}>
              {coverage.name}: {coverage.meteosatHours}/{coverage.totalHours}{' '}
              hours from Meteosat
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
