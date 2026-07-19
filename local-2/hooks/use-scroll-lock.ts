"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

// Scroll lock is owned entirely by Lenis (lenis.stop()/start()) — no CSS
// or body-class based backstop, per ARCH-02. Cleanup always resumes scroll
// so an unmount mid-lock never leaves the page stuck.
export function useScrollLock(isLocked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (isLocked) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [lenis, isLocked])
}
