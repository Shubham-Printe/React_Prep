import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Counter from './Counter'

describe('Counter', () => {
  it('renders with initial count', () => {
    render(<Counter initial={3} />)

    expect(screen.getByText('Count: 3')).toBeInTheDocument()
  })

  it('increments and decrements the count', async () => {
    const user = userEvent.setup()
    render(<Counter initial={0} />)

    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
