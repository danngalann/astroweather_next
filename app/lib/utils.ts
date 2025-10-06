// Helper function to check if a time is between sunrise and sunset
export function isDaytime(
  hourTime: string,
  sunrise: string,
  sunset: string,
): boolean {
  const hourDate = new Date(hourTime)
  const hourMinutes = hourDate.getHours() * 60 + hourDate.getMinutes()

  // Parse 12-hour format time (e.g., "07:56 AM")
  const parse12HourTime = (time: string): number => {
    const [timeStr, period] = time.split(' ')
    const [hourStr, minStr] = timeStr.split(':')
    let hour = Number(hourStr)
    const min = Number(minStr)

    if (period === 'PM' && hour !== 12) {
      hour += 12
    } else if (period === 'AM' && hour === 12) {
      hour = 0
    }

    return hour * 60 + min
  }

  const sunriseMinutes = parse12HourTime(sunrise)
  const sunsetMinutes = parse12HourTime(sunset)

  return hourMinutes >= sunriseMinutes && hourMinutes <= sunsetMinutes
}

// Format weather icon URL to ensure proper protocol
export function formatWeatherIconUrl(iconUrl: string): string {
  return iconUrl.startsWith('//') ? `http:${iconUrl}` : iconUrl
}

// Get border and background styles based on location quality
export function getLocationQualityStyles(isGoodPlace?: boolean): string {
  return isGoodPlace
    ? 'border-green-400 ring-2 ring-green-700'
    : 'border-zinc-700'
}

// Get cloud cover quality assessment
export function getCloudCoverQuality(cloudCover: number): {
  label: string
  emoji: string
} {
  if (cloudCover < 30) {
    return { label: 'Excellent', emoji: '✨' }
  } else if (cloudCover < 60) {
    return { label: 'Moderate', emoji: '⚠️' }
  } else {
    return { label: 'Poor', emoji: '❌' }
  }
}

// Get cloud cover styling classes
export function getCloudCoverStyles(cloudCover: number): string {
  if (cloudCover < 30) {
    return 'border-green-500 bg-green-500/10'
  } else if (cloudCover < 60) {
    return 'border-yellow-500 bg-yellow-500/10'
  } else {
    return 'border-red-500 bg-red-500/10'
  }
}

// Get moon illumination styling classes
export function getMoonIlluminationStyles(illumination: number): string {
  if (illumination < 25) {
    return 'border-green-500 bg-green-500/10'
  } else if (illumination < 50) {
    return 'border-yellow-500 bg-yellow-500/10'
  } else {
    return 'border-orange-500 bg-orange-500/10'
  }
}

// Get hourly cloud cover background styles
export function getHourlyCloudStyles(cloudCover: number): string {
  if (cloudCover < 30) {
    return 'bg-green-500/20'
  } else if (cloudCover < 60) {
    return 'bg-yellow-500/20'
  } else {
    return 'bg-red-500/20'
  }
}

// Get day/night styling for hourly cards
export function getDayNightStyles(isDay: boolean): string {
  return isDay
    ? 'border-yellow-600/50 bg-yellow-900/20'
    : 'border-zinc-700 bg-zinc-900/50'
}
