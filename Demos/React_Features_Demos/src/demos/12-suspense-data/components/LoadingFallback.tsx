export default function LoadingFallback({ label }: { label: string }) {
  return <div style={{ fontSize: 12, color: '#64748b' }}>Loading {label}…</div>
}
