import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import UserProfile from './UserProfile'

const userResponse = { name: 'Jamie' }

describe('UserProfile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a loading state first', () => {
    const pendingPromise = new Promise(() => {})
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingPromise))

    render(<UserProfile />)

    expect(screen.getByText('Loading user...')).toBeInTheDocument()
  })

  it('renders user data on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => userResponse,
      })
    )

    render(<UserProfile />)

    expect(await screen.findByText('Welcome, Jamie.')).toBeInTheDocument()
  })

  it('renders an error message on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    render(<UserProfile />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong.'
    )
  })
})
