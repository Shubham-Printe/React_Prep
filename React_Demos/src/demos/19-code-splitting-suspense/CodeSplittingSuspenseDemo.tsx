import { useState, lazy, Suspense } from 'react'
import { wait } from './helpers/WaitHelper' // just to simulate a slow loading module

const AdminDashboardPanel = lazy(() => wait(1000).then(() => import('./components/AdminDashboardPanel')));
const AnalyticsPanel = lazy(() => wait(1000).then(() => import('./components/AnalyticsPanel')));
const GalleryPanel = lazy(() => wait(1000).then(() => import('./components/GalleryPanel')));
const ReportsPanel = lazy(() => wait(1000).then(() => import('./components/ReportsPanel')));

type TabKey = 'admin-dashboard' | 'analytics' | 'gallery' | 'reports'

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'admin-dashboard', label: 'Admin Dashboard' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'reports', label: 'Reports' },
]

export default function CodeSplittingSuspenseDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>('admin-dashboard')

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #94a3b8',
              background: activeTab === tab.key ? '#e2e8f0' : '#f8fafc',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
        <Suspense fallback={<div>Loading {activeTab}...</div>}>
            {activeTab === 'admin-dashboard' && <AdminDashboardPanel />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'gallery' && <GalleryPanel />}
            {activeTab === 'reports' && <ReportsPanel />}
        </Suspense>
      </div>
    </section>
  )
}
