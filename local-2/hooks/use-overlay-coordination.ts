"use client"

import { useEffect, useSyncExternalStore } from "react"

// Mutual-exclusivity substrate for SERV-03: a module-scope store (not
// Context, not a body-attribute polled by a DOM observer) shared by
// MenuOverlay and CapabilitiesSection so each side can read a real boolean
// about the other overlay's open state. Resets naturally on full page
// reload since this is a browser-only, no-SSR-hydration client module.
export type OverlayKey = "menu" | "drawer"
type OverlayState = Record<OverlayKey, boolean>

let state: OverlayState = { menu: false, drawer: false }
const listeners = new Set<() => void>()

function setOverlay(key: OverlayKey, open: boolean) {
  if (state[key] === open) return
  state = { ...state, [key]: open }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

// Call with your OWN key + isOpen; writes your state into the shared store
// and returns whether the OTHER overlay is open. Used by MenuOverlay and
// CapabilitiesSection to disable each other's trigger while one is active.
export function useOverlayCoordination(key: OverlayKey, isOpen: boolean): boolean {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    setOverlay(key, isOpen)
    return () => setOverlay(key, false)
  }, [key, isOpen])

  const otherKey: OverlayKey = key === "menu" ? "drawer" : "menu"
  return snapshot[otherKey]
}

// Read-only selector — subscribes to the store without writing to it, so
// consumers like an inert boundary can read whether the drawer/menu is open
// without clobbering the state either side owns.
export function useOverlayOpen(key: OverlayKey): boolean {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  return snapshot[key]
}
