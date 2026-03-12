export default function Crashable({ active, label }: { active: boolean; label: string }) {
  if (active) throw new Error(label)
  return null
}
