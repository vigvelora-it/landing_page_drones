const message = encodeURIComponent(
  "Hola, visité la web de Skytech Solutions y quisiera conversar sobre un proyecto.",
)

export function WhatsAppButton() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")
  const href = number
    ? `https://wa.me/${number}?text=${message}`
    : `https://wa.me/?text=${message}`

  return (
    <a
      className="whatsapp-button"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir a Skytech Solutions por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16.04 3A12.9 12.9 0 0 0 5.1 22.75L3.4 29l6.4-1.68A12.98 12.98 0 1 0 16.04 3Zm0 23.65c-1.9 0-3.77-.5-5.4-1.44l-.39-.23-3.8 1 1.02-3.7-.25-.38a10.68 10.68 0 1 1 8.82 4.75Zm5.86-8c-.32-.16-1.9-.94-2.2-1.04-.29-.1-.5-.16-.7.16-.22.32-.83 1.04-1.02 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.2c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.22.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.3.33-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.3 3.31.17.21 2.26 3.45 5.48 4.84.76.33 1.36.53 1.83.68.77.25 1.47.21 2.02.13.62-.1 1.9-.78 2.17-1.53.26-.74.26-1.38.18-1.51-.08-.14-.29-.22-.61-.38Z" />
      </svg>
      <span>WhatsApp</span>
    </a>
  )
}
