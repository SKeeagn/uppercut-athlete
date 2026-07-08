"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { track } from "@vercel/analytics";

const STORAGE_KEY = "grsc-2026";
const IN_APP_BANNER_DISMISSED_KEY = "grsc-2026-in-app-banner-dismissed";
const IN_APP_BROWSER_PATTERN = /WhatsApp|FBAN|FBAV|Instagram/i;
const IOS_PATTERN = /iPhone|iPad|iPod/i;
const ANDROID_PATTERN = /Android/i;

type Section = {
  number: string;
  title: string;
  field1: { key: string; label: string };
  field2: { key: string; label: string };
  check: { key: string; label: string };
};

const SECTIONS: Section[] = [
  {
    number: "01",
    title: "LOCKER — I AM CONFIDENT IN WHAT I HAVE IN MY LOCKER",
    field1: {
      key: "lockerStrengths",
      label: "Three proven strengths that will show up in the game",
    },
    field2: {
      key: "lockerRelied",
      label: "What you bring that others rely on",
    },
    check: {
      key: "lockerConfirm",
      label:
        "I have earned the right to be here and am confident in my ability.",
    },
  },
  {
    number: "02",
    title: "TRUST — I TRUST THE WORK I HAVE UNDER MY BELT",
    field1: {
      key: "trustWork",
      label: "The work that has earned trust in yourself",
    },
    field2: {
      key: "trustHabits",
      label: "Habits that made you game-fit and mentally sharp",
    },
    check: {
      key: "trustConfirm",
      label: "My preparation has been consistent.",
    },
  },
  {
    number: "03",
    title: "ROLE — I AM CLEAR ON MY ROLE AND THE PLAN",
    field1: {
      key: "roleExact",
      label: "Your exact role in this game",
    },
    field2: {
      key: "roleActions",
      label: "Two or three key actions that support a strong performance",
    },
    check: {
      key: "roleConfirm",
      label: "I understand my responsibilities under pressure.",
    },
  },
  {
    number: "04",
    title: "MIND — NOTHING AND NO ONE WILL MESS WITH MY MIND",
    field1: {
      key: "mindCommit",
      label: "The mindset you commit to carrying into the arena",
    },
    field2: {
      key: "mindTriggers",
      label: "Your triggers, and your response strategy",
    },
    check: {
      key: "mindConfirm",
      label: "I control what I focus on. Nothing external gets in.",
    },
  },
];

const FOOTER_ITEMS = [
  { label: "WHEN", text: "Evening after selection, in a quiet setting." },
  { label: "FRAME", text: "Treat it as a performance ritual." },
  { label: "AIM", text: "Not perfection — proof of readiness." },
  { label: "TONE", text: "Short, honest, real." },
  { label: "RELOAD", text: "Review again in the hours before the game." },
];

type FormState = Record<string, string | boolean>;

function emptyState(): FormState {
  const state: FormState = {};
  for (const section of SECTIONS) {
    state[section.field1.key] = "";
    state[section.field2.key] = "";
    state[section.check.key] = false;
  }
  state.weeklyGrowth = "";
  state.growthConfirm = false;
  return state;
}

const CHECK_KEYS = [...SECTIONS.map((section) => section.check.key), "growthConfirm"];

export default function Page() {
  const [formData, setFormData] = useState<FormState>(emptyState);
  const [interacted, setInteracted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showInAppBanner, setShowInAppBanner] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const hasTrackedCompletion = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setInteracted(true);
      } catch {
        // ignore malformed data
      }
    }
    setHydrated(true);

    const userAgent = navigator.userAgent;
    setPlatform(
      IOS_PATTERN.test(userAgent)
        ? "ios"
        : ANDROID_PATTERN.test(userAgent)
          ? "android"
          : "other",
    );

    const dismissed = sessionStorage.getItem(IN_APP_BANNER_DISMISSED_KEY);
    if (!dismissed && IN_APP_BROWSER_PATTERN.test(userAgent)) {
      setShowInAppBanner(true);
    }
  }, []);

  function handleDismissInAppBanner() {
    sessionStorage.setItem(IN_APP_BANNER_DISMISSED_KEY, "true");
    setShowInAppBanner(false);
  }

  function handleTextChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleTextBlur() {
    setInteracted(true);
    setFormData((prev) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
      return prev;
    });
  }

  function handleCheckboxChange(key: string, checked: boolean) {
    setInteracted(true);
    setFormData((prev) => {
      const next = { ...prev, [key]: checked };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const ready = CHECK_KEYS.every((key) => formData[key]);

  useEffect(() => {
    if (ready && !hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      track("completed");
    }
  }, [ready]);

  if (!hydrated) {
    return null;
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-10 px-5 py-10">
      {showInAppBanner && (
        <InAppBrowserBanner platform={platform} onDismiss={handleDismissInAppBanner} />
      )}

      <header className="flex flex-col gap-4">
        <h1 className="font-condensed text-3xl font-bold uppercase leading-tight tracking-tight">
          Game Readiness State <span className="text-gold">Checklist</span>
        </h1>
        <p className="text-sm leading-relaxed text-slate-400">
          To help you stabilise <strong className="font-semibold text-slate-200">confidence, focus and control</strong> in the 48+ hours before game. Use this
          checklist to <strong className="font-semibold text-slate-200">evidence your readiness</strong> and align your mind and body. This is your{" "}
          <strong className="font-semibold text-slate-200">transition from preparation to performance</strong>.
        </p>
        <p className="flex items-center gap-2 text-xs text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-gold/60" />
          Saved automatically on this device.
        </p>
      </header>

      <ChecklistForm
        formData={formData}
        onTextChange={handleTextChange}
        onTextBlur={handleTextBlur}
        onCheckboxChange={handleCheckboxChange}
      />

      <GrowthSection
        formData={formData}
        onTextChange={handleTextChange}
        onTextBlur={handleTextBlur}
        onCheckboxChange={handleCheckboxChange}
      />

      <ReadyBanner interacted={interacted} ready={ready} />

      <Footer />
    </main>
  );
}

function ChecklistForm({
  formData,
  onTextChange,
  onTextBlur,
  onCheckboxChange,
}: {
  formData: FormState;
  onTextChange: (key: string, value: string) => void;
  onTextBlur: () => void;
  onCheckboxChange: (key: string, checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      {SECTIONS.map((section) => (
        <section key={section.number} className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3 border-b border-gold/30 pb-3">
            <span className="font-condensed text-2xl font-bold text-gold">
              {section.number}
            </span>
            <h2 className="font-condensed text-lg font-semibold uppercase leading-tight">
              {section.title}
            </h2>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">{section.field1.label}</span>
            <AutoGrowTextarea
              value={formData[section.field1.key] as string}
              onChange={(value) => onTextChange(section.field1.key, value)}
              onBlur={onTextBlur}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">{section.field2.label}</span>
            <AutoGrowTextarea
              value={formData[section.field2.key] as string}
              onChange={(value) => onTextChange(section.field2.key, value)}
              onBlur={onTextBlur}
            />
          </label>

          <label className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              checked={formData[section.check.key] as boolean}
              onChange={(e) => onCheckboxChange(section.check.key, e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-gold"
            />
            <span className="text-sm text-white/90">{section.check.label}</span>
          </label>
        </section>
      ))}
    </div>
  );
}

function AutoGrowTextarea({
  value,
  onChange,
  onBlur,
  maxLength = 280,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  maxLength?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    if (textareaRef.current) {
      resize(textareaRef.current);
    }
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    resize(e.target);
    onChange(e.target.value);
  }

  const remaining = maxLength - value.length;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        maxLength={maxLength}
        className="resize-none overflow-hidden rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-gold"
      />
      {remaining <= 30 && (
        <span
          className={
            remaining <= 10
              ? "text-right text-xs text-gold"
              : "text-right text-xs text-white/40"
          }
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function GrowthSection({
  formData,
  onTextChange,
  onTextBlur,
  onCheckboxChange,
}: {
  formData: FormState;
  onTextChange: (key: string, value: string) => void;
  onTextBlur: () => void;
  onCheckboxChange: (key: string, checked: boolean) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-condensed text-base font-semibold uppercase leading-tight text-white/80">
        Why are you better than you were last week?
      </h2>

      <label className="flex flex-col gap-2">
        <textarea
          value={formData.weeklyGrowth as string}
          onChange={(e) => onTextChange("weeklyGrowth", e.target.value)}
          onBlur={onTextBlur}
          rows={4}
          className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-gold"
        />
      </label>

      <label className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          checked={formData.growthConfirm as boolean}
          onChange={(e) => onCheckboxChange("growthConfirm", e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-gold"
        />
        <span className="text-sm text-white/90">This is my honest reflection.</span>
      </label>
    </section>
  );
}

function InAppBrowserBanner({
  platform,
  onDismiss,
}: {
  platform: "ios" | "android" | "other";
  onDismiss: () => void;
}) {
  const message =
    platform === "ios"
      ? 'For the best experience, tap ••• and choose "Open in Safari" before filling this in.'
      : 'For the best experience, open this in your browser before filling this in.';

  return (
    <div className="flex items-start gap-3 rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
      <p className="flex-1 leading-snug">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-gold/70 transition hover:text-gold"
      >
        ✕
      </button>
    </div>
  );
}

function ReadyBanner({ interacted, ready }: { interacted: boolean; ready: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      {interacted && (
        <p
          className={
            ready
              ? "font-condensed text-4xl font-bold text-gold underline decoration-2 underline-offset-8 drop-shadow-[0_0_20px_rgba(201,162,75,0.5)]"
              : "font-condensed text-4xl font-bold text-white/20"
          }
        >
          I&rsquo;m Ready.
        </p>
      )}
      <p className="text-xs text-gold/60">
        Your answers stay on this device. We only see how many people used
        this and completed it, not what they wrote.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-4 border-t border-white/10 pt-8">
      {FOOTER_ITEMS.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <span className="font-condensed text-xs font-bold tracking-[0.2em] text-gold">
            {item.label}
          </span>
          <span className="text-sm text-white/70">{item.text}</span>
        </div>
      ))}
    </footer>
  );
}
