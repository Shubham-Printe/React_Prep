import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function getPortalRoot(): HTMLElement {
  let root = document.getElementById('portal-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'portal-root'
    document.body.appendChild(root)
  }
  return root
}

function Modal({ children, onClose, returnFocusRef }: { children: ReactNode; onClose: () => void; returnFocusRef?: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      // return focus to opener
      if (returnFocusRef?.current instanceof HTMLElement) {
        returnFocusRef.current.focus()
      }
    }
  }, [onClose])
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
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
        style={{ background: 'white', padding: 16, borderRadius: 8, minWidth: 320, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} autoFocus style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>,
    getPortalRoot(),
  )
}

function Tooltip({ anchorRef, text, open }: { anchorRef: React.RefObject<HTMLElement>; text: string; open: boolean }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  useLayoutEffect(() => {
    if (!open) return
    function update() {
      const el = anchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [anchorRef, open])
  if (!open || !pos) return null
  return createPortal(
    <div style={{ position: 'fixed', top: pos.top, left: pos.left, transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none' }}>
      <div style={{ position: 'relative', background: '#0f172a', color: 'white', borderRadius: 6, padding: '6px 8px', fontSize: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }}>
        {text}
        <div
          style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid #0f172a',
          }}
        />
      </div>
    </div>,
    getPortalRoot(),
  )
}

function Dropdown({ anchorRef, open, onClose }: { anchorRef: React.RefObject<HTMLElement>; open: boolean; onClose: () => void }) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  useLayoutEffect(() => {
    if (!open) return
    function update() {
      const el = anchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    function onDocClick(ev: MouseEvent) {
      const target = ev.target as Node
      if (anchorRef.current && anchorRef.current.contains(target)) return
      onClose()
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    document.addEventListener('mousedown', onDocClick)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [anchorRef, open, onClose])
  if (!open || !pos) return null
  return createPortal(
    <div style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 1000 }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 10px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
        {['Action 1', 'Action 2', 'Action 3'].map((label) => (
          <button
            key={label}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', border: 'none', background: 'white', cursor: 'pointer' }}
            onClick={onClose}
          >
            {label}
          </button>
        ))}
      </div>
    </div>,
    getPortalRoot(),
  )
}

type Toast = { id: number; text: string }
function ToastHost({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return createPortal(
    <div style={{ position: 'fixed', top: 16, right: 16, display: 'grid', gap: 8, zIndex: 1000 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: '#0f172a', color: 'white', borderRadius: 8, padding: '8px 10px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{t.text}</span>
            <button onClick={() => onDismiss(t.id)} style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: 6, border: '1px solid #475569', background: '#1f2937', color: 'white', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>,
    getPortalRoot(),
  )
}

export default function PortalsDemo() {
  const [open, setOpen] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  function pushToast(text: string) {
    const id = Date.now()
    setToasts((ts) => [...ts, { id, text }])
    // auto dismiss
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2500)
  }
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#ffffff', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, color: '#475569', marginRight: 8 }}>
          Portal root target: <code>#portal-root</code> (appended to document.body)
        </div>
        <button onClick={() => setOpen(true)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer' }}>
          Open Modal (portal)
        </button>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          Modal uses createPortal(element, <code>#portal-root</code>) so it overlays the entire page
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', border: '1px dashed #94a3b8', padding: 12, borderRadius: 8, maxWidth: 260 }}>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, whiteSpace: 'nowrap' }}>Clipped container</div>
          <button
            ref={btnRef}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#f1f5f9', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Hover for tooltip
          </button>
          <div style={{ marginTop: 120, fontSize: 12, color: '#94a3b8' }}>Small filler to create slight overflow.</div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
            Tooltip uses createPortal(element, <code>#portal-root</code>) so it isn’t clipped by this container
          </div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', border: '1px dashed #94a3b8', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, whiteSpace: 'nowrap' }}>Dropdown inside clipped area</div>
          <button
            ref={menuBtnRef}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#f1f5f9', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Toggle menu
          </button>
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
            Menu panel uses createPortal(element, <code>#portal-root</code>) and positions under the button
          </div>
        </div>
        <button onClick={() => pushToast('Saved changes')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #94a3b8', background: '#e2e8f0', cursor: 'pointer' }}>
          Show toast
        </button>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          Toasts use createPortal(element, <code>#portal-root</code>) so they float above everything
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#ffffff' }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Why portals?</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 14 }}>
          <li>Modal is rendered into document.body to escape parent stacking and clipping.</li>
          <li>Tooltip is positioned relative to its anchor, but portaled to body to avoid being cut off by overflow.</li>
          <li>Dropdown menu can escape overflow/stacking and still anchor to its button.</li>
          <li>Toasts render at the top layer regardless of current route/component tree position.</li>
        </ul>
        <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
          All examples target the same shared <code>#portal-root</code> appended once to <code>document.body</code>.
        </div>
      </div>

      {open && (
        <Modal onClose={() => setOpen(false)} returnFocusRef={btnRef}>
          <h3 id="portal-modal-title" style={{ marginTop: 0 }}>Portal Modal</h3>
          <p style={{ margin: 0 }}>This content is rendered into document.body via a portal.</p>
        </Modal>
      )}
      <Tooltip anchorRef={btnRef} text="I'm rendered in body via a portal" open={showTip} />
      <Dropdown anchorRef={menuBtnRef} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ToastHost toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((t) => t.id !== id))} />
    </section>
  )
}


