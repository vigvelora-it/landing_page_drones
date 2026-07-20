"use client"

import type { ReactNode } from "react"

import { useOverlayOpen } from "@/hooks/use-overlay-coordination"

// Explicit, grep-able `inert` boundary for the background while the service
// drawer is open (SERV-02 "inert en el fondo"). Native showModal() already
// makes the rest of the document inert automatically (dialogs escape
// ancestor inertness by spec) — this wrapper is belt-and-suspenders, not the
// mechanism that actually enforces modality. Read-only selector only — this
// component must never write to the shared overlay-coordination store.
export function InertBoundary({ children }: { children: ReactNode }) {
  const drawerOpen = useOverlayOpen("drawer")

  return (
    <div style={{ display: "contents" }} inert={drawerOpen || undefined}>
      {children}
    </div>
  )
}
