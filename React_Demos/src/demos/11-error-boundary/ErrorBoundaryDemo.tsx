import SectionNestedBoundaries from './sections/SectionNestedBoundaries'
import SectionNotCaught from './sections/SectionNotCaught'

export default function ErrorBoundaryDemo() {
  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <SectionNestedBoundaries />
      <SectionNotCaught />
    </section>
  )
}


