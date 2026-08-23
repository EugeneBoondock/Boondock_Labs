"use client";

import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { useState } from "react";
import styles from "./home.module.css";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus("error");
      return;
    }

    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.contactFormRow}>
        <label>
          <span>Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            disabled={status === "sending"}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={status === "sending"}
          />
        </label>
      </div>
      <label>
        <span>Project</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="What are you building, and where do you need help?"
          disabled={status === "sending"}
        />
      </label>
      <div className={styles.contactFormFooter}>
        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send it through"}
          <ArrowRight size={15} />
        </button>
        {status === "sent" ? (
          <p className={styles.formNote} data-tone="good">
            <Check size={14} /> Received. The studio will reply to your email.
          </p>
        ) : null}
        {status === "error" ? (
          <p className={styles.formNote} data-tone="bad">
            <TriangleAlert size={14} /> That did not go through. Please try
            again in a moment.
          </p>
        ) : null}
      </div>
    </form>
  );
}
