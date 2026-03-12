import { useEffect, useState } from 'react'

export default function useGlobalErrorLog() {
  const [globalErrors, setGlobalErrors] = useState<string[]>([])
  useEffect(() => {
    function onWindowError(_msg: any, _src: any, _line: any, _col: any, err: any) {
      setGlobalErrors((g) => [...g, String(err?.message ?? _msg)])
      return false
    }
    function onUnhandled(ev: PromiseRejectionEvent) {
      setGlobalErrors((g) => [...g, String(ev.reason?.message ?? ev.reason)])
    }
    window.addEventListener('error', onWindowError as any)
    window.addEventListener('unhandledrejection', onUnhandled)
    return () => {
      window.removeEventListener('error', onWindowError as any)
      window.removeEventListener('unhandledrejection', onUnhandled)
    }
  }, [])

  return { globalErrors, clearGlobalErrors: () => setGlobalErrors([]) }
}
