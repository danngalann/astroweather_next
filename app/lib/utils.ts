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

  console.table({
    hourTime,
    hourMinutes,
    sunrise,
    sunriseMinutes,
    sunset,
    sunsetMinutes,
  })

  return hourMinutes >= sunriseMinutes && hourMinutes <= sunsetMinutes
}
