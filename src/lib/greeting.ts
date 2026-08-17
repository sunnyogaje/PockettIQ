/** Time-of-day greeting anchored to Nigeria time (WAT, UTC+1), regardless of server timezone. */
export function timeOfDayGreeting(now: Date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Lagos",
    }).format(now)
  )

  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}
