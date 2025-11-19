import { ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', padding: 16, borderRadius: 8, minWidth: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function PortalsDemo() {
  const [open, setOpen] = useState(false)
  return (
    <section>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3>Portal Modal</h3>
          <p>This content is rendered into document.body via a portal.</p>
        </Modal>
      )}
    </section>
  )
}


