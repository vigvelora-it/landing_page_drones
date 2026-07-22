"use client"

import { FormEvent, useRef } from "react"

import { Arrow } from "@/components/arrow"
import { services } from "@/lib/site-content"

export function ContactForm({ reveal = true }: { reveal?: boolean }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const button = buttonRef.current
    const status = statusRef.current
    const data = new FormData(form)

    if (button) button.disabled = true
    if (status) {
      status.className = "form-status is-pending"
      status.textContent = "Enviando solicitud…"
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(result.message ?? "No pudimos enviar tu solicitud.")
      form.reset()
      if (status) {
        status.className = "form-status is-success"
        status.textContent = "Solicitud recibida. Nos pondremos en contacto contigo."
      }
    } catch (error) {
      if (status) {
        status.className = "form-status is-error"
        status.textContent = error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente."
      }
    } finally {
      if (button) button.disabled = false
    }
  }

  return (
    <form className="contact-form" data-reveal={reveal || undefined} noValidate onSubmit={handleSubmit}>
      <div className="field-row">
        <label><span>Nombre *</span><input name="name" type="text" autoComplete="name" required placeholder="Tu nombre" /></label>
        <label><span>Empresa</span><input name="company" type="text" autoComplete="organization" placeholder="Nombre de empresa" /></label>
      </div>
      <label><span>Correo *</span><input name="email" type="email" autoComplete="email" required placeholder="nombre@empresa.com" /></label>
      <label>
        <span>Servicio</span>
        <select name="service" defaultValue="">
          <option value="" disabled>Selecciona una capacidad</option>
          {services.map((service) => <option key={service.number}>{service.title}</option>)}
        </select>
      </label>
      <label><span>Proyecto *</span><textarea name="message" required minLength={10} rows={3} placeholder="Ubicación, área aproximada y objetivo del levantamiento" /></label>
      <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="submit-button magnetic" ref={buttonRef} type="submit">
        <span>Enviar solicitud</span><Arrow />
      </button>
      <p className="form-status" ref={statusRef} aria-live="polite" />
    </form>
  )
}
