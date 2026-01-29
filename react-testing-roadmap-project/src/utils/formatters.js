export function capitalize(value) {
  if (!value) return ''
  return value[0].toUpperCase() + value.slice(1)
}

export function formatFullName(firstName, lastName) {
  const first = capitalize(firstName?.trim() || '')
  const last = capitalize(lastName?.trim() || '')

  if (!first && !last) return ''
  if (!first) return last
  if (!last) return first
  return `${first} ${last}`
}
