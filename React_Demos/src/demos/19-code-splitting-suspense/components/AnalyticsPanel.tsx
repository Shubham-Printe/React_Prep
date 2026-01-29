import { useState } from 'react';

const moduleLoadedAt = new Date().toLocaleTimeString()

const rawMetrics = Array.from({ length: 20000 }, (_, i) => ({
  id: i + 1,
  value: Math.round(Math.sin(i / 10) * 1000 + 1000),
}))


export default function AnalyticsPanel() {
  const [metricTotal, setMetricTotal] = useState(0);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Analytics Overview</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>Module loaded at: {moduleLoadedAt}</div>
      <div style={{ fontSize: 12, color: '#475569' }}>

        <button
          onClick={async () => {

            // here we are dynamically importing the compute module when the button is clicked

            import('../helpers/ComputeHelpers')
              .then((module) => {
                setMetricTotal(module.computeMetricTotal(rawMetrics));
              })
              .catch((error) => {
                console.error('Error loading compute module:', error);
              })

          }}
        >
          Compute Metric Total
        </button>
        <br/>
        <br/>
        Metrics loaded: {rawMetrics.length} · Total value: {metricTotal.toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>
        Showing a small slice of computed metrics to keep DOM size reasonable.
      </div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {rawMetrics.slice(0, 8).map((metric) => (
          <li key={metric.id}>
            Metric {metric.id}: {metric.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
