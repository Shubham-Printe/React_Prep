import { useParams } from 'react-router-dom'

export function Overview() {
  const { id } = useParams()
  return <div>Overview for user {id}</div>
}

export function Profile() {
  const { id } = useParams()
  return <div>Profile for user {id} (public)</div>
}

export function Settings() {
  const { id } = useParams()
  return <div>Settings for user {id} (protected)</div>
}

