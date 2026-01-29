import { Post } from '../data/fetchers'
import { Resource } from '../data/resource'

export default function Posts({ resource }: { resource: Resource<Post[]> }) {
  const posts = resource.read()
  return (
    <ul style={{ margin: '8px 0 0 16px' }}>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
