import { computeColorSummary } from '../helpers/ComputeHelpers';

const moduleLoadedAt = new Date().toLocaleTimeString()

const photos = Array.from({ length: 12000 }, (_, i) => ({
  id: i + 1,
  color: `hsl(${i % 360} 70% 70%)`,
}))

const colorSummary = computeColorSummary(photos);

export default function GalleryPanel() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Gallery</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>Module loaded at: {moduleLoadedAt}</div>
      <div style={{ fontSize: 12, color: '#475569' }}>Photos loaded: {photos.length}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {Object.keys(colorSummary)
          .slice(0, 10)
          .map((color) => (
            <span
              key={color}
              style={{
                background: color,
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              {colorSummary[color]} tiles
            </span>
          ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
        {photos.slice(0, 24).map((photo) => (
          <div
            key={photo.id}
            style={{
              background: photo.color,
              height: 32,
              borderRadius: 6,
            }}
          />
        ))}
      </div>
    </div>
  )
}
