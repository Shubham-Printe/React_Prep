import { useEffect, useState } from 'react'

export default function UserProfile() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await fetch('/api/user')
        if (!response.ok) {
          throw new Error('Request failed')
        }
        const data = await response.json()
        if (active) {
          setUser(data)
          setStatus('success')
        }
      } catch (error) {
        if (active) {
          setStatus('error')
        }
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return <p>Loading user...</p>
  }

  if (status === 'error') {
    return <p role="alert">Something went wrong.</p>
  }

  return <p>Welcome, {user.name}.</p>
}
