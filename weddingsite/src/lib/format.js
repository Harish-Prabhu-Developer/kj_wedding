export function longDate(iso) {
  const d = new Date(iso + 'T12:00:00+05:30')
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Kolkata'
  })
}

export function shortDate(iso) {
  const d = new Date(iso + 'T12:00:00+05:30')
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata'
  })
}

export function istDateTime(iso) {
  return new Date(iso)
    .toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    })
    .replace(' at ', ' · ') + ' IST'
}
