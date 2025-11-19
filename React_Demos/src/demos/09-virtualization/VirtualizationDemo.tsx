import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

const bigData = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  text: `Row #${i + 1}`,
}))

function Row({ index, style }: ListChildComponentProps) {
  const item = bigData[index]
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: '1px solid #eee',
        background: index % 2 === 0 ? '#fff' : '#fafafa',
      }}
    >
      <strong style={{ width: 60 }}>#{item.id}</strong>
      <span>{item.text}</span>
    </div>
  )
}

export default function VirtualizationDemo() {
  return (
    <section>
      <div style={{ border: '1px solid #ddd' }}>
        <List height={360} itemCount={bigData.length} itemSize={40} width={520}>
          {Row}
        </List>
      </div>
    </section>
  )
}


