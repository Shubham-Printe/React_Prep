import { useState } from 'react';

const moduleLoadedAt = new Date().toLocaleTimeString()

const reportRows = Array.from({ length: 16000 }, (_, i) => ({
  id: i + 1,
  title: `Report ${i + 1}`,
  score: Math.round((Math.cos(i / 7) + 1) * 50),
}))

export default function ReportsPanel() {

  const [averageScore, setAverageScore] = useState(0);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Reports</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>Module loaded at: {moduleLoadedAt}</div>
      <div style={{ fontSize: 12, color: '#475569' }}>

        <button
          onClick={async () => {

            // here we are dynamically importing the compute module when the button is clicked

            import('../helpers/ComputeHelpers')
              .then((module) => {
                setAverageScore(module.computeAverageScore(reportRows));
              })
              .catch((error) => {
                console.error('Error loading compute module:', error);
              })

          }}
        >
          Compute Average Score
        </button>
        <br/>
        <br/>

        Reports loaded: {reportRows.length} · Avg score: {averageScore}
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>Showing a small slice for readability.</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {reportRows.slice(0, 8).map((row) => (
          <li key={row.id}>
            {row.title} — score {row.score}
          </li>
        ))}
      </ul>
    </div>
  )
}
