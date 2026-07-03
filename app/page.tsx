"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "grsc-2026";

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
  return state;
}

export default function Page() {
  const [formData, setFormData] = useState<FormState>(emptyState);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setSubmitted(true);
      } catch {
        // ignore malformed data
      }
    }
    setHydrated(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setSubmitted(true);
  }

  function handleEdit() {
    setSubmitted(false);
  }

  if (!hydrated) {
    return null;
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-10 px-5 py-10">
      <header className="flex flex-col gap-1">
        <p className="font-condensed text-sm font-semibold tracking-[0.3em] text-gold">
          UPPERCUT
        </p>
        <h1 className="font-condensed text-3xl font-bold uppercase leading-tight tracking-tight">
          Game Readiness State Checklist
        </h1>
      </header>

      {submitted ? (
        <Summary formData={formData} onEdit={handleEdit} />
      ) : (
        <Form formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
      )}

      <Footer />
    </main>
  );
}

function Form({
  formData,
  setFormData,
  onSubmit,
}: {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent) => void;
}) {
  function update(key: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
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
            <input
              type="text"
              value={formData[section.field1.key] as string}
              onChange={(e) => update(section.field1.key, e.target.value)}
              className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">{section.field2.label}</span>
            <input
              type="text"
              value={formData[section.field2.key] as string}
              onChange={(e) => update(section.field2.key, e.target.value)}
              className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-gold"
            />
          </label>

          <label className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              checked={formData[section.check.key] as boolean}
              onChange={(e) => update(section.check.key, e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-gold"
            />
            <span className="text-sm text-white/90">{section.check.label}</span>
          </label>
        </section>
      ))}

      <button
        type="submit"
        className="rounded-md bg-gold px-6 py-4 font-condensed text-lg font-bold uppercase tracking-wide text-navy transition hover:brightness-110"
      >
        Confirm Readiness
      </button>
    </form>
  );
}

function Summary({
  formData,
  onEdit,
}: {
  formData: FormState;
  onEdit: () => void;
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

          <SummaryField
            label={section.field1.label}
            value={formData[section.field1.key] as string}
          />
          <SummaryField
            label={section.field2.label}
            value={formData[section.field2.key] as string}
          />

          <div className="flex items-start gap-3 pt-1">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                formData[section.check.key]
                  ? "border-gold bg-gold text-navy"
                  : "border-white/30 text-transparent"
              }`}
            >
              ✓
            </span>
            <span className="text-sm text-white/90">{section.check.label}</span>
          </div>
        </section>
      ))}

      <div className="flex flex-col items-center gap-6 pt-2">
        <p className="font-condensed text-4xl font-bold text-gold">
          I&rsquo;m Ready.
        </p>
        <button
          onClick={onEdit}
          className="rounded-md border border-gold px-6 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-gold transition hover:bg-gold hover:text-navy"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-white/95">{value || "—"}</span>
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
