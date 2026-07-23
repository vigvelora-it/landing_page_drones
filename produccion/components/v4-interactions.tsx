"use client";

import { useEffect } from "react";

type ContactForm = HTMLFormElement & {
  name: HTMLInputElement;
  company: HTMLInputElement;
  email: HTMLInputElement;
  service: HTMLSelectElement;
  message: HTMLTextAreaElement;
};

declare global {
  interface Window {
    closeMobileMenu: () => void;
    handleSubmit: (event: SubmitEvent) => Promise<void>;
  }
}

export function V4Interactions() {
  useEffect(() => {
    const button = document.getElementById("hamburger");
    const menu = document.getElementById("mobile-menu");

    const closeMobileMenu = () => {
      menu?.classList.remove("open");
      button?.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      if (!button || !menu) return;
      const open = menu.classList.toggle("open");
      button.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    };

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (button && menu && !button.contains(target) && !menu.contains(target)) {
        closeMobileMenu();
      }
    };

    button?.addEventListener("click", toggleMenu);
    document.addEventListener("click", closeOnOutsideClick);
    window.closeMobileMenu = closeMobileMenu;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    document.querySelectorAll(".rv").forEach((element) => observer.observe(element));

    const row = document.getElementById("trust-row");
    const previous = document.getElementById("t-prev");
    const next = document.getElementById("t-next");
    let index = 0;

    const visibleCards = () => (window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
    const updateSlider = () => {
      if (!row || !row.children[0]) return;
      const maximum = Math.max(0, row.children.length - visibleCards());
      index = Math.min(index, maximum);
      const width = row.children[0].getBoundingClientRect().width;
      row.style.transform = `translateX(-${index * (width + 20)}px)`;
    };
    const showPrevious = () => {
      index = Math.max(index - 1, 0);
      updateSlider();
    };
    const showNext = () => {
      if (!row) return;
      index = Math.min(index + 1, Math.max(0, row.children.length - visibleCards()));
      updateSlider();
    };

    previous?.addEventListener("click", showPrevious);
    next?.addEventListener("click", showNext);
    window.addEventListener("resize", updateSlider);

    window.handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.target as ContactForm;
      const submitButton = document.getElementById("submit-btn") as HTMLButtonElement | null;
      const oldError = form.querySelector(".form-error");
      oldError?.remove();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.value.trim(),
            company: form.company.value.trim(),
            email: form.email.value.trim(),
            service: form.service.value,
            message: form.message.value.trim(),
            website: (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "",
          }),
        });
        const result = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(result.message ?? "No pudimos enviar tu solicitud.");

        form.style.display = "none";
        document.getElementById("form-success")?.classList.add("show");
        form.reset();
      } catch (error) {
        const message = document.createElement("p");
        message.className = "form-error";
        message.setAttribute("role", "alert");
        message.textContent =
          error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente.";
        form.appendChild(message);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar solicitud ↗";
        }
      }
    };

    const form = document.getElementById("contact-form");
    if (form && !form.querySelector('[name="website"]')) {
      const honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "website";
      honeypot.tabIndex = -1;
      honeypot.autocomplete = "off";
      honeypot.setAttribute("aria-hidden", "true");
      honeypot.style.cssText = "position:absolute;left:-9999px;opacity:0;pointer-events:none";
      form.appendChild(honeypot);
    }

    return () => {
      button?.removeEventListener("click", toggleMenu);
      document.removeEventListener("click", closeOnOutsideClick);
      previous?.removeEventListener("click", showPrevious);
      next?.removeEventListener("click", showNext);
      window.removeEventListener("resize", updateSlider);
      observer.disconnect();
    };
  }, []);

  return null;
}
