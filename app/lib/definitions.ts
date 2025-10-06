// Meteosat scraped data models

export interface MeteosatForecast {
  /** Individual forecast entry from Meteosat. */
  datetime: string
  temperature: number
  wind_speed: number
  precipitation: number
  humidity: number
  mist: boolean
  dew_point: number
  cloud_cover: number
}

export interface MeteosatData {
  /** Meteosat data for a location. */
  slug: string
  forecast: MeteosatForecast[]
  fetched_at: string
}

// Place configuration model

export interface Place {
  /** A place/location to fetch weather data for. */
  name: string
  query: string
  bortle: number
  slug: string
}

// Weather API data structures

export interface Condition {
  /** Weather condition information. */
  text: string
  icon: string
  code: number
}

export interface AirQuality {
  /** Air quality measurements. */
  co: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  us_epa_index: number
  gb_defra_index: number
}

export interface Location {
  /** Location information. */
  query: string
  name: string
  slug: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime_epoch: number
  localtime: string
  bortle: number
  isGoodPlaceTonight?: boolean // default false
}

export type DataOrigin = 'meteosat' | 'weatherapi'

export interface Current {
  /** Current weather conditions. */
  last_updated_epoch: number
  last_updated: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: Condition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  vis_km: number
  vis_miles: number
  uv: number
  gust_mph: number
  gust_kph: number
  air_quality?: AirQuality | null
  data_origin: DataOrigin
}

export interface Hour {
  /** Hourly forecast data. */
  time_epoch: number
  time: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: Condition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  windchill_c: number
  windchill_f: number
  heatindex_c: number
  heatindex_f: number
  dewpoint_c: number
  dewpoint_f: number
  will_it_rain: number
  chance_of_rain: number
  will_it_snow: number
  chance_of_snow: number
  vis_km: number
  vis_miles: number
  gust_mph: number
  gust_kph: number
  uv: number
  air_quality?: AirQuality | null
  data_origin: DataOrigin
}

export interface Day {
  /** Daily forecast summary. */
  maxtemp_c: number
  maxtemp_f: number
  mintemp_c: number
  mintemp_f: number
  avgtemp_c: number
  avgtemp_f: number
  maxwind_mph: number
  maxwind_kph: number
  totalprecip_mm: number
  totalprecip_in: number
  totalsnow_cm: number
  avgvis_km: number
  avgvis_miles: number
  avghumidity: number
  daily_will_it_rain: number
  daily_chance_of_rain: number
  daily_will_it_snow: number
  daily_chance_of_snow: number
  condition: Condition
  uv: number
  air_quality?: AirQuality | null
}

export interface Astro {
  /** Astronomical data for the day. */
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  moon_phase: string
  moon_illumination: number
  is_moon_up: number
  is_sun_up: number
}

export interface ForecastDay {
  /** Forecast data for a single day. */
  date: string
  date_epoch: number
  day: Day
  astro: Astro
  hour: Hour[]
}

export interface Forecast {
  /** Weather forecast data. */
  forecastday: ForecastDay[]
}

export interface WeatherData {
  /** Complete weather data response. */
  location: Location
  current: Current
  forecast: Forecast
}
