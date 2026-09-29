"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy, EnvelopeSimple, GithubLogo, LinkedinLogo, WarningCircle } from "@phosphor-icons/react";
import { inquiryTypes, profile } from "@/lib/data";
import { InteractiveButton } from "./interactive-button";
import { Magnetic } from "./magnetic";
import { Reveal } from "./reveal";
import { ChapterHeading } from "./chapter-heading";
import { SkillsOrbit } from "./skills-orbit";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: EnvelopeSimple },
  { label: "GitHub", value: profile.githubHandle, href: profile.github, icon: GithubLogo },
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, icon: LinkedinLogo },
];

type SendState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [inquiry, setInquiry] = useState(inquiryTypes[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState(""); // honeypot — left empty by real visitors
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSendState("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, note, inquiry, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSendState("error");
        setErrorMessage(data.error || "Something went wrong — try again.");
        return;
      }

      setSendState("sent");
      setName("");
      setEmail("");
      setNote("");
    } catch {
      setSendState("error");
      setErrorMessage("Network error — check your connection and try again.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <section id="contact" className="bg-bg-raised px-5 sm:px-8 py-20 sm:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ChapterHeading
            index="04"
            eyebrow="Contact & availability"
            title="Let's build"
            titleAccent="something good."
          />
          <Reveal delay={0.05} className="flex justify-center">
            <SkillsOrbit />
          </Reveal>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <Reveal delay={0.05}>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-accent mb-5">
                Send a note
              </p>

              {/* Honeypot — hidden from sighted and screen-reader users alike,
                  but present in the DOM for form-filling bots to trip over. */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />

              <div className="flex flex-wrap gap-2 mb-6">
                {inquiryTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInquiry(type)}
                    className={`font-sans text-[11px] tracking-wide uppercase px-3.5 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
                      inquiry === type
                        ? "bg-accent text-accent-ink border-accent"
                        : "border-border-strong text-muted-fg hover:text-fg"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="font-sans text-[10px] tracking-widest uppercase text-muted-fg">
                    Name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1.5 w-full bg-transparent border-b border-border-strong pb-2 outline-none focus-visible:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-sans text-[10px] tracking-widest uppercase text-muted-fg">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5 w-full bg-transparent border-b border-border-strong pb-2 outline-none focus-visible:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="note" className="font-sans text-[10px] tracking-widest uppercase text-muted-fg">
                    Note
                  </label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    required
                    className="mt-1.5 w-full bg-transparent border-b border-border-strong pb-2 outline-none focus-visible:border-accent transition-colors resize-none"
                  />
                </div>
              </div>

              {sendState === "sent" ? (
                <div className="mt-6 flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-5 py-3.5 font-sans text-sm text-accent">
                  <Check size={16} weight="bold" />
                  Message sent — I&rsquo;ll get back to you soon.
                </div>
              ) : (
                <InteractiveButton
                  type="submit"
                  label={sendState === "sending" ? "Sending…" : "Send message"}
                  icon={<ArrowRight size={16} weight="bold" />}
                  className="mt-6"
                  disabled={sendState === "sending"}
                />
              )}

              {sendState === "error" && (
                <p className="mt-3 flex items-center gap-1.5 font-sans text-xs text-danger">
                  <WarningCircle size={14} />
                  {errorMessage}
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.1} className="space-y-3">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-fg mb-2">
              Correspondence
            </p>
            {channels.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-accent active:scale-[0.98] transition-all cursor-pointer"
              >
                <Icon size={18} className="text-accent shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block font-sans text-[10px] tracking-widest uppercase text-muted-fg">
                    {label}
                  </span>
                  <span className="block text-sm truncate">{value}</span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-muted-fg group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                />
              </a>
            ))}

            <Magnetic strength={0.15} className="block w-full">
              <button
                type="button"
                onClick={copyEmail}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border-strong py-3 font-sans text-xs tracking-wide uppercase hover:border-accent hover:text-accent active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={copied ? "check" : "copy"}
                      initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inline-flex"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {copied ? "Copied" : "Copy email"}
              </button>
            </Magnetic>

            <Magnetic strength={0.15} className="block w-full">
              <a
                href={profile.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border-strong py-3 font-sans text-xs tracking-wide uppercase hover:border-accent hover:text-accent active:scale-[0.98] transition-all cursor-pointer"
              >
                Download résumé
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
