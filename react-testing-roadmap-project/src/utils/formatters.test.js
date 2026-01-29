import { describe, expect, it } from 'vitest'
import { capitalize, formatFullName } from './formatters'

describe('formatters', () => {
  it('capitalizes a string', () => {
    expect(capitalize('react')).toBe('React')
  })

  it('handles empty values for capitalize', () => {
    expect(capitalize('')).toBe('')
    expect(capitalize(null)).toBe('')
  })

  it('formats full name with trimming', () => {
    expect(formatFullName('  jane', 'doe  ')).toBe('Jane Doe')
  })

  it('formats full name when one side is missing', () => {
    expect(formatFullName('jane', '')).toBe('Jane')
    expect(formatFullName('', 'doe')).toBe('Doe')
  })
})
