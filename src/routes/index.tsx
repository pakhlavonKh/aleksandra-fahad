import { useEffect, useState } from "react";
import flatlayImg from "@/assets/boarding-flatlay.jpg";
import passportImg from "@/assets/passport-portrait.jpg";
import stampsImg from "@/assets/stamps-detail.jpg";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .draw-line");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });
    // Safety fallback: force-show anything still hidden after 2s
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible), .draw-line:not(.is-visible)").forEach((el) => {
        el.classList.add("is-visible");
      });
    }, 2000);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
}

export default function Index() {
  const [opened, setOpened] = useState(false);
  useReveal();

  return (
    <main className="paper-texture min-h-screen text-foreground">
      <Nav />
      <Hero opened={opened} setOpened={setOpened} />
      <FlatlayBanner />
      <BoardingPass />
      <Journey />
      <Destination />
      <LoveStory />
      <RSVP />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-paper/70 border-b hairline border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase">A &nbsp;✦&nbsp; F · 26 · 06 · 2026</div>
        <nav className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.25em] uppercase">
          <a href="#boarding" className="hover:text-graphite transition">Талон</a>
          <a href="#journey" className="hover:text-graphite transition">Маршрут</a>
          <a href="#destination" className="hover:text-graphite transition">Место</a>
          <a href="#story" className="hover:text-graphite transition">История</a>
          <a href="#rsvp" className="hover:text-graphite transition">RSVP</a>
        </nav>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase">Gate · 01</div>
      </div>
    </header>
  );
}

function Hero({ opened, setOpened }: { opened: boolean; setOpened: (v: boolean) => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, #000 0, transparent 40%), radial-gradient(circle at 80% 70%, #000 0, transparent 40%)",
      }} />

      <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-12 reveal">
        — Приглашение первого класса —
      </div>

      <div className="relative w-full max-w-[420px] aspect-[3/4.3]" style={{ perspective: "2000px" }}>
        {/* Boarding pass behind passport */}
        <div
          className={`absolute inset-x-6 bottom-0 transition-all duration-1000 ease-out ${
            opened ? "translate-y-32 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <MiniTicket />
        </div>

        {/* Passport */}
        <div
          className="absolute inset-0 ink-texture rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] border hairline border-white/10 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transformOrigin: "left center",
            transform: opened ? "rotateY(-22deg) translateX(-8%)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute inset-0 p-10 flex flex-col items-center justify-between text-center">
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40">
              Wedding Republic · Свидетельство приглашения
            </div>

            <div className="flex flex-col items-center gap-6">
              <CompassMark />
              <div className="space-y-3">
                <div className="embossed-light font-display text-[28px] leading-tight tracking-[0.15em] uppercase">
                  Passport
                </div>
                <div className="text-white/50 font-mono text-[10px] tracking-[0.5em] uppercase">to wedding</div>
              </div>
              <div className="h-px w-24 bg-white/20" />
              <div className="space-y-1">
                <div className="font-display text-white/90 text-2xl tracking-wide">Фахад</div>
                <div className="text-white/30 font-mono text-[9px] tracking-[0.4em]">&amp;</div>
                <div className="font-display text-white/90 text-2xl tracking-wide">Александра</div>
              </div>
            </div>

            <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/30">
              26 · 06 · 2026 — серия AF №2026
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpened(!opened)}
        className="mt-16 group relative font-mono text-[11px] tracking-[0.4em] uppercase px-10 py-4 border hairline border-foreground hover:bg-foreground hover:text-paper transition-colors duration-500"
      >
        <span className="relative z-10">{opened ? "Закрыть паспорт" : "Открыть приглашение"}</span>
      </button>

      <div className="mt-12 font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
        ↓ Прокрутите для посадочного талона
      </div>
    </section>
  );
}

function CompassMark() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="text-white/40">
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <path d="M40 10 L43 40 L40 70 L37 40 Z" fill="currentColor" opacity="0.6" />
      <path d="M10 40 L40 37 L70 40 L40 43 Z" fill="currentColor" opacity="0.3" />
      <text x="40" y="14" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">N</text>
      <text x="40" y="72" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">S</text>
      <text x="12" y="42" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">W</text>
      <text x="68" y="42" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">E</text>
    </svg>
  );
}

function MiniTicket() {
  return (
    <div className="bg-card border hairline border-border rounded-sm shadow-xl px-6 py-4 flex items-center justify-between">
      <div>
        <div className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground uppercase">Boarding</div>
        <div className="font-display text-xl">TAS → LOV</div>
      </div>
      <div className="barcode w-20 h-10" />
    </div>
  );
}

/* ---------------- Boarding Pass ---------------- */
function BoardingPass() {
  return (
    <section id="boarding" className="px-6 py-32 max-w-6xl mx-auto">
      <SectionLabel index="01" title="Посадочный талон" subtitle="Boarding pass" />

      <div className="reveal mt-16 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mb-12 items-end">
        <figure className="relative">
          <img
            src={passportImg}
            alt="Свадебный паспорт с компасом"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full aspect-square object-cover grayscale shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]"
          />
          <figcaption className="mt-3 font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
            Образец · Specimen 01
          </figcaption>
        </figure>
        <p className="font-display text-2xl md:text-3xl leading-snug text-graphite max-w-xl">
          Ваш персональный талон ждёт. Один пассажир, один рейс,
          <span className="text-foreground"> одно направление</span> — навсегда.
        </p>
      </div>

      <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto] bg-card border hairline border-border shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)]">
        {/* Main */}
        <div className="p-10 lg:p-14 relative">
          <div className="flex items-start justify-between border-b hairline border-border pb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground uppercase">Wedding Airlines</div>
              <div className="font-display text-3xl mt-1">First Class · Boarding Pass</div>
            </div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-graphite uppercase text-right">
              Flight<br />
              <span className="text-foreground text-xl tracking-[0.15em]">AF 0626</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8 mt-10">
            <Field label="Пассажир" value="Уважаемый гость" mono={false} />
            <Field label="От" value="TAS · Ташкент" />
            <Field label="К" value="LOV · Любовь" />
            <Field label="Дата" value="26 · 06 · 2026" />
            <Field label="Время посадки" value="15:30" />
            <Field label="Церемония" value="16:00" />
            <Field label="Выход" value="01" />
            <Field label="Место" value="1A" />
            <Field label="Класс" value="First" />
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="dotted-route flex-1 h-px" />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Direct flight · Lago Park</span>
            <div className="dotted-route flex-1 h-px" />
          </div>

          <div className="mt-10 flex items-end justify-between">
            <div className="barcode w-2/3 h-14" />
            <div className="text-right">
              <div className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase">Confirmation</div>
              <div className="font-mono text-sm tracking-[0.25em] mt-1">AF · 260626 · 1A</div>
            </div>
          </div>
        </div>

        {/* Stub */}
        <div className="border-t lg:border-t-0 lg:border-l border-dashed border-border p-10 flex flex-col justify-between min-w-[220px] relative">
          <div className="absolute -top-2 left-1/2 lg:left-auto lg:top-1/2 lg:-left-2 w-4 h-4 rounded-full bg-paper border hairline border-border" />
          <div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Stub</div>
            <div className="font-display text-xl mt-1">A · F</div>
            <div className="mt-6 space-y-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <div>TAS → LOV</div>
              <div>26 · 06 · 26</div>
              <div>Gate 01 · Seat 1A</div>
            </div>
          </div>
          <div className="mt-10">
            <QrCode />
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-b hairline border-border pb-3">
      <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-2 ${mono ? "font-mono tracking-[0.1em]" : "font-display text-xl"} text-foreground`}>
        {value}
      </div>
    </div>
  );
}

function QrCode() {
  // 8x8 stylized QR (decorative, monochrome)
  const cells = [
    "11111110","10000010","10111010","10111010",
    "10111010","10000010","11111110","00000000",
  ];
  return (
    <div className="grid grid-cols-8 gap-[2px] w-24 h-24">
      {cells.flatMap((row, r) =>
        row.split("").map((c, i) => (
          <div key={`${r}-${i}`} className={c === "1" ? "bg-foreground" : "bg-transparent"} />
        ))
      )}
    </div>
  );
}

/* ---------------- Journey / Departures ---------------- */
function Journey() {
  const rows = [
    { time: "15:00", code: "AF 01", title: "Сбор гостей", gate: "A", status: "On Time" },
    { time: "16:00", code: "AF 02", title: "Церемония", gate: "B", status: "Boarding" },
    { time: "17:00", code: "AF 03", title: "Фотосессия", gate: "C", status: "Scheduled" },
    {
      time: "18:00",
      code: "AF 04",
      title: "Приветственный коктейль",
      gate: "D",
      status: "Scheduled",
    },
    { time: "19:00", code: "AF 05", title: "Ужин", gate: "E", status: "Scheduled" },
    { time: "21:00", code: "AF 06", title: "Первый танец", gate: "F", status: "Scheduled" },
    { time: "23:00", code: "AF 07", title: "After Party", gate: "G", status: "Scheduled" },
  ];
  return (
    <section id="journey" className="ink-texture text-paper py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel index="02" title="Расписание рейсов" subtitle="Departures" inverted />

        <div className="reveal mt-16 border-y border-white/15">
          <div className="py-4 border-b border-white/10 font-mono text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-white/40 flex gap-4 px-4">
            <div className="w-16">Время</div>
            <div className="flex-1">Событие</div>
            <div className="w-20">Рейс</div>
            <div className="w-24 text-right">Статус</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="py-4 border-b border-white/10 items-center group hover:bg-white/[0.03] transition flex gap-4 px-4"
            >
              <div className="font-mono text-lg md:text-xl tracking-[0.1em] whitespace-nowrap w-16 text-white">{r.time}</div>
              <div className="flex-1 font-display text-base md:text-xl text-white">{r.title}</div>
              <div className="font-mono text-[9px] md:text-sm tracking-[0.2em] text-white/60 w-20">{r.code}</div>
              <div className="text-right font-mono text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white/80 w-24">
                <span className="inline-block w-1.5 h-1.5 bg-white/80 mr-2 align-middle" />
                {r.status}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 font-mono text-[9px] tracking-[0.4em] uppercase text-white/40">
          Все рейсы выполняются по местному времени · GMT +3
        </div>
      </div>
    </section>
  );
}

/* ---------------- Destination ---------------- */
function Destination() {
  return (
    <section id="destination" className="py-32 px-6 max-w-6xl mx-auto">
      <SectionLabel index="03" title="Пункт назначения" subtitle="Destination" />

      <div className="reveal mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Координаты</div>
            <div className="font-mono text-2xl tracking-[0.15em] mt-2"><a href="https://maps.app.goo.gl/YFYhZmrHeFZ8zeFXA?g_st=it" target="_blank" rel="noopener noreferrer" className="hover:text-graphite transition">Lago Park</a></div>
          </div>
          <div className="h-px bg-border" />
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Терминал</div>
            <div className="font-display text-4xl mt-2 leading-tight">Lago Park</div>
            <div className="text-graphite mt-3"><a href="https://maps.app.goo.gl/YFYhZmrHeFZ8zeFXA?g_st=it" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">View on Google Maps</a></div>
          </div>
          <div className="h-px bg-border" />
        </div>

        <div className="relative aspect-square border hairline border-border bg-card overflow-hidden">
          <Map />
          <div className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
            LAGO PARK · Venue
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
            Scale 1 : 12 000
          </div>
        </div>
      </div>
    </section>
  );
}

function Map() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(0.85 0 0)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#grid)" />
      {/* river */}
      <path
        d="M0 240 C 80 220, 140 280, 220 250 S 360 220, 400 260"
        fill="none"
        stroke="oklch(0.6 0 0)"
        strokeWidth="8"
        opacity="0.3"
      />
      <path
        d="M0 240 C 80 220, 140 280, 220 250 S 360 220, 400 260"
        fill="none"
        stroke="oklch(0.4 0 0)"
        strokeWidth="0.5"
      />
      {/* roads */}
      <path d="M50 50 L 350 350" stroke="oklch(0.7 0 0)" strokeWidth="0.5" />
      <path d="M350 50 L 50 350" stroke="oklch(0.7 0 0)" strokeWidth="0.5" />
      <path d="M200 0 L 200 400" stroke="oklch(0.7 0 0)" strokeWidth="0.5" />
      <path d="M0 200 L 400 200" stroke="oklch(0.7 0 0)" strokeWidth="0.5" />
      {/* dotted route */}
      <path
        className="draw-line"
        d="M60 80 Q 180 140 200 240"
        fill="none"
        stroke="oklch(0.15 0 0)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* origin */}
      <circle cx="60" cy="80" r="4" fill="oklch(0.15 0 0)" />
      <text x="70" y="78" fontSize="9" fontFamily="monospace" fill="oklch(0.15 0 0)">START</text>
      {/* destination */}
      <g transform="translate(200,240)">
        <circle r="14" fill="none" stroke="oklch(0.15 0 0)" strokeWidth="1" />
        <circle r="6" fill="oklch(0.15 0 0)" />
        <text y="34" fontSize="9" fontFamily="monospace" fill="oklch(0.15 0 0)" textAnchor="middle">Lago Park</text>
      </g>
    </svg>
  );
}

/* ---------------- Love Story ---------------- */
function LoveStory() {
  const stamps = [
    { year: "2019", place: "PARIS", note: "Первая встреча в кафе на Монмартре." },
    { year: "2021", place: "ROMA", note: "Первое путешествие вдвоём." },
    { year: "2023", place: "TOKYO", note: "«Да» под цветущей сакурой." },
    { year: "2024", place: "REYKJAVIK", note: "Помолвка под северным сиянием." },
  ];
  return (
    <section id="story" className="py-32 px-6 max-w-6xl mx-auto">
      <SectionLabel index="04" title="История любви" subtitle="Travel diary" />

      <div className="reveal mt-16 relative bg-card border hairline border-border p-10 md:p-16 overflow-hidden">
        <img
          src={stampsImg}
          alt=""
          loading="lazy"
          width={1920}
          height={1080}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] mix-blend-multiply pointer-events-none"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
          {stamps.map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <Stamp text={s.place} year={s.year} />
              <div className="pt-2">
                <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">{s.year} · Visa</div>
                <p className="font-display text-2xl leading-snug mt-2">{s.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 pt-10 border-t hairline border-border">
          <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Запись в дневнике</div>
          <p className="font-display text-3xl md:text-4xl leading-relaxed max-w-3xl text-graphite">
            «Любить — значит смотреть в одном направлении. Мы выбираем направление —
            <span className="text-foreground"> навсегда</span>.»
          </p>
        </div>
      </div>
    </section>
  );
}

function Stamp({ text, year }: { text: string; year: string }) {
  return (
    <div className="stamp shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center">
      <div className="font-mono text-[8px] tracking-[0.3em]">WEDDING</div>
      <div className="font-display text-base leading-none mt-1">{text}</div>
      <div className="font-mono text-[8px] tracking-[0.2em] mt-1">{year}</div>
    </div>
  );
}

/* ---------------- RSVP ---------------- */
function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="rsvp" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionLabel index="05" title="Подтверждение посадки" subtitle="Immigration form" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="reveal mt-16 bg-card border hairline border-border p-10 md:p-14 space-y-10"
        >
          <div className="flex items-start justify-between border-b hairline border-border pb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Form AN-2026</div>
              <div className="font-display text-2xl mt-1">Декларация гостя</div>
            </div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground text-right">
              Заполните<br />печатными буквами
            </div>
          </div>

          <FormRow label="Фамилия и имя" placeholder="ИВАНОВ ИВАН" />
          <FormRow label="Электронная почта" placeholder="EMAIL@DOMAIN.COM" type="email" />
          <FormRow label="Телефон" placeholder="+7 (000) 000-00-00" type="tel" />

          <div>
            <Label>Количество персон</Label>
            <div className="flex gap-3 mt-3">
              {["01", "02", "03", "04+"].map((n) => (
                <label key={n} className="flex-1">
                  <input type="radio" name="ppl" className="peer sr-only" defaultChecked={n === "01"} />
                  <div className="border hairline border-border py-4 text-center font-mono text-sm tracking-[0.2em] cursor-pointer peer-checked:bg-foreground peer-checked:text-paper transition">
                    {n}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Подтверждаю присутствие</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {["Да, лечу", "К сожалению, нет"].map((n, i) => (
                <label key={n} className="block">
                  <input type="radio" name="att" className="peer sr-only" defaultChecked={i === 0} />
                  <div className="border hairline border-border py-4 text-center font-mono text-[11px] tracking-[0.25em] uppercase cursor-pointer peer-checked:bg-foreground peer-checked:text-paper transition">
                    {n}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Особые пожелания / диета</Label>
            <textarea
              rows={3}
              className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.05em] resize-none"
              placeholder="—"
            />
          </div>

          <div className="pt-6 border-t hairline border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
              Подпись: ___________________ &nbsp; · &nbsp; Дата: 09 · 08 · 2026
            </div>
            <button
              type="submit"
              className="font-mono text-[11px] tracking-[0.4em] uppercase px-10 py-4 bg-foreground text-paper hover:bg-graphite transition-colors duration-500"
            >
              {submitted ? "Посадка подтверждена ✓" : "Подтвердить посадку"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">{children}</div>;
}

function FormRow({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.15em] uppercase placeholder:text-muted-foreground/40"
      />
    </div>
  );
}

/* ---------------- Section label ---------------- */
function SectionLabel({
  index,
  title,
  subtitle,
  inverted = false,
}: {
  index: string;
  title: string;
  subtitle: string;
  inverted?: boolean;
}) {
  return (
    <div className="reveal flex items-end justify-between gap-8 border-b hairline pb-6" style={{ borderColor: inverted ? "rgba(255,255,255,0.15)" : undefined }}>
      <div>
        <div className={`font-mono text-[10px] tracking-[0.4em] uppercase ${inverted ? "text-white/40" : "text-muted-foreground"}`}>
          № {index} · {subtitle}
        </div>
        <h2 className={`font-display text-5xl md:text-6xl mt-3 ${inverted ? "text-paper" : ""}`}>{title}</h2>
      </div>
      <div className={`hidden md:block font-mono text-[9px] tracking-[0.3em] uppercase ${inverted ? "text-white/40" : "text-muted-foreground"}`}>
        Section {index} / 05
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="ink-texture text-paper px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-b border-white/15 pb-10">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40">Final call</div>
            <div className="font-display text-5xl md:text-6xl mt-3 text-paper leading-tight">
              See you on board.
            </div>
            <div className="font-display text-2xl text-white/60 mt-2">Фахад &amp; Александра · 2026</div>
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 space-y-1 text-right">
            <div>Wedding Airlines · AF 0626</div>
            <div>TAS → LOV · Gate 01</div>
            <div>26 · 06 · 2026 · 16:00</div>
          </div>
        </div>
        <div className="mt-8 font-mono text-[20px] tracking-[0.4em] text-white/70 text-center">
          <p>made with ❤ by <a href="https://invito.live" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition">invito.live</a></p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Flatlay Banner ---------------- */
function FlatlayBanner() {
  return (
    <section className="relative overflow-hidden border-y hairline border-border">
      <img
        src={flatlayImg}
        alt="Свадебный паспорт и посадочный талон — flat-lay"
        loading="lazy"
        width={1600}
        height={1200}
        className="w-full h-[60vh] md:h-[80vh] object-cover grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-paper/95 via-paper/10 to-paper/40" />
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14">
        <div className="flex items-start justify-between font-mono text-[10px] tracking-[0.4em] uppercase text-foreground">
          <span>Document № AF-0626 · 01</span>
          <span className="hidden md:block">Издано Wedding Republic</span>
        </div>
        <div className="max-w-2xl">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Издание первое</div>
          <h2 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">
            Каждое путешествие<br />начинается с документа.
          </h2>
        </div>
      </div>
    </section>
  );
}
