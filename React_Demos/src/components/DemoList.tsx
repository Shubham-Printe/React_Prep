import { Link } from 'react-router-dom'
import { demos } from '../demos/_registry'

export function DemoList() {
  return (
    <div>
      <p style={{ marginTop: 0 }}>
        Explore essential React concepts. Click any demo to view it in isolation.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {demos.map((demo) => (
          <li
            key={demo.slug}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{demo.title}</h2>
              <code style={{ color: '#888' }}>/ {demo.slug}</code>
            </div>
            <p style={{ margin: '8px 0 12px' }}>{demo.description}</p>
            <Link to={`/${demo.slug}`}>Open demo →</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


