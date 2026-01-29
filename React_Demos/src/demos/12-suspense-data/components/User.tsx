import { Resource } from '../data/resource'
import { User as UserType } from '../data/fetchers'

export default function User({ resource }: { resource: Resource<UserType> }) {
  const user = resource.read()
  return (
    <div>
      <strong>Loaded:</strong> {user.name} (id: {user.id})
    </div>
  )
}
