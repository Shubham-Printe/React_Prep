import { useMemo, useState } from 'react'
import { ControlsPanel, Posts, ResourceCard, User } from '../components'
import { fetchPosts, fetchUser, getResource, preloadResource } from '../data'

export default function SuspenseDataSection() {
  const [version, setVersion] = useState(0)
  const [userId, setUserId] = useState(1)
  const [delay, setDelay] = useState(1200)
  const [failUser, setFailUser] = useState(false)
  const [failPosts, setFailPosts] = useState(false)

  const userKey = `user:${userId}:${delay}:${failUser}:${version}`
  const postsKey = `posts:${userId}:${delay}:${failPosts}:${version}`

  const userResource = useMemo(
    () => getResource(userKey, () => fetchUser(userId, delay, failUser)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userKey],
  )
  const postsResource = useMemo(
    () => getResource(postsKey, () => fetchPosts(userId, delay, failPosts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postsKey],
  )

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <ControlsPanel
        userId={userId}
        delay={delay}
        failUser={failUser}
        failPosts={failPosts}
        onUserChange={setUserId}
        onDelayChange={setDelay}
        onFailUserChange={setFailUser}
        onFailPostsChange={setFailPosts}
        onPreload={() => {
          preloadResource(userKey, () => fetchUser(userId, delay, failUser))
          preloadResource(postsKey, () => fetchPosts(userId, delay, failPosts))
        }}
        onRefetch={() => setVersion((v) => v + 1)}
      />

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <ResourceCard badge="User" title="Details" onRetry={() => setVersion((v) => v + 1)}>
          <User resource={userResource} />
        </ResourceCard>

        <ResourceCard badge="Posts" title="Recent" onRetry={() => setVersion((v) => v + 1)}>
          <Posts resource={postsResource} />
        </ResourceCard>
      </div>
    </section>
  )
}
