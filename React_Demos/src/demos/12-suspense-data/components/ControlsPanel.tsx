export default function ControlsPanel({
  userId,
  delay,
  failUser,
  failPosts,
  onUserChange,
  onDelayChange,
  onFailUserChange,
  onFailPostsChange,
  onPreload,
  onRefetch,
}: {
  userId: number
  delay: number
  failUser: boolean
  failPosts: boolean
  onUserChange: (value: number) => void
  onDelayChange: (value: number) => void
  onFailUserChange: (value: boolean) => void
  onFailPostsChange: (value: boolean) => void
  onPreload: () => void
  onRefetch: () => void
}) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 12,
        background: '#f8fafc',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        User:
        <select value={userId} onChange={(e) => onUserChange(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Delay:
        <select value={delay} onChange={(e) => onDelayChange(Number(e.target.value))}>
          <option value={500}>500ms</option>
          <option value={1200}>1200ms</option>
          <option value={2500}>2500ms</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={failUser} onChange={(e) => onFailUserChange(e.target.checked)} />
        Fail user
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={failPosts} onChange={(e) => onFailPostsChange(e.target.checked)} />
        Fail posts
      </label>
      <button
        onClick={onPreload}
        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        Preload
      </button>
      <button
        onClick={onRefetch}
        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        Refetch
      </button>
    </div>
  )
}
