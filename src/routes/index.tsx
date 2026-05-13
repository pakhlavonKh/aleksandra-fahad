import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Label } from "@/components/ui/label";
import flatlayImg from "@/assets/boarding-flatlay.jpg";
import passportImg from "@/assets/passport-portrait.jpg";
import stampsImg from "@/assets/stamps-detail.jpg";
import boardingPassImg from "@/assets/pass.png";
import map from "@/assets/map.png";
import plane from "@/assets/plane.png";
import takeOff from "@/assets/audio.mp3";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .draw-line, .animated-plane");
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
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
      document
        .querySelectorAll(".reveal:not(.is-visible), .draw-line:not(.is-visible)")
        .forEach((el) => {
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
  const [audioMuted, setAudioMuted] = useState(false);
  const [browserMuted, setBrowserMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  useReveal();

  useEffect(() => {
    // Handle user interaction to start audio
    let hasPlayed = false;

    const handleInteraction = () => {
      if (hasPlayed || !audioRef.current) return;
      hasPlayed = true;

      audioRef.current.muted = false;
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playing successfully");
            setBrowserMuted(false);
            // Remove all listeners after successful play
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
            document.removeEventListener("touchmove", handleInteraction);
            document.removeEventListener("pointerdown", handleInteraction);
          })
          .catch((err) => {
            console.log("Audio play error:", err.message);
            setBrowserMuted(true);
            hasPlayed = false; // Reset flag on error to retry
          });
      }
    };

    // Add multiple event types for better mobile support
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction, { passive: true });
    document.addEventListener("touchmove", handleInteraction, { passive: true });
    document.addEventListener("pointerdown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("touchmove", handleInteraction);
      document.removeEventListener("pointerdown", handleInteraction);
    };
  }, []);

  useEffect(() => {
    // Update muted state
    if (audioRef.current) {
      audioRef.current.muted = audioMuted;
    }
  }, [audioMuted]);

  return (
    <main className="paper-texture min-h-screen text-foreground">
      <audio ref={audioRef} preload="auto" style={{ display: "none" }}>
        <source src={takeOff} type="audio/mpeg" />
      </audio>
      <button
        onClick={() => setAudioMuted(!audioMuted)}
        className={`fixed bottom-6 right-6 z-50 p-3 transition ${
          browserMuted ? "opacity-50 cursor-not-allowed" : "hover:text-graphite"
        }`}
        title={browserMuted ? "Audio blocked by browser" : audioMuted ? "Unmute" : "Mute"}
      >
        {audioMuted || browserMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
      <Nav />
      <Hero opened={opened} setOpened={setOpened} />
      <FlatlayBanner />
      <BoardingPass />
      <Journey />
      <Destination />
      <LoveStory />
      <CountdownAndCalendar />
      <Gifts />
      <RSVP />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-paper/70 border-b hairline border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase">
          A &nbsp;✦&nbsp; F · 26 · 06 · 2026
        </div>
        <nav className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.25em] uppercase">
          <a href="#boarding" className="hover:text-graphite transition">
            Талон
          </a>
          <a href="#journey" className="hover:text-graphite transition">
            Маршрут
          </a>
          <a href="#destination" className="hover:text-graphite transition">
            Место
          </a>
          <a href="#story" className="hover:text-graphite transition">
            История
          </a>
          <a href="#rsvp" className="hover:text-graphite transition">
            RSVP
          </a>
        </nav>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase">Gate · 01</div>
      </div>
    </header>
  );
}

function Hero({ opened, setOpened }: { opened: boolean; setOpened: (v: boolean) => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.5 0 0) 0, transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.5 0 0) 0, transparent 40%)",
        }}
      />

      <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-12 reveal">
        — Приглашение первого класса —
      </div>

      <div
        className="relative w-full max-w-[420px] aspect-[3/4.3]"
        style={{ perspective: "2000px" }}
      >
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
          className="absolute inset-0 ink-texture rounded-sm shadow-[0_30px_80px_-20px_rgba(120,120,120,0.3)] border hairline border-white/10 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
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
                <div className="text-white/50 font-mono text-[10px] tracking-[0.5em] uppercase">
                  to wedding
                </div>
              </div>
              <div className="h-px w-24 bg-white/20" />
              <div className="space-y-1">
                <div className="font-cursive text-white/90 text-3xl md:text-4xl">Фахад</div>
                <div className="text-white/30 font-mono text-[9px] tracking-[0.4em]">&amp;</div>
                <div className="font-cursive text-white/90 text-3xl md:text-4xl">Александра</div>
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
      <text
        x="40"
        y="14"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="monospace"
      >
        N
      </text>
      <text
        x="40"
        y="72"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="monospace"
      >
        S
      </text>
      <text
        x="12"
        y="42"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="monospace"
      >
        W
      </text>
      <text
        x="68"
        y="42"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="monospace"
      >
        E
      </text>
    </svg>
  );
}

function MiniTicket() {
  return (
    <div className="bg-card border hairline border-border rounded-sm shadow-xl px-6 py-4 flex items-center justify-between">
      <div>
        <div className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground uppercase">
          Boarding
        </div>
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
            src={boardingPassImg}
            alt="Свадебный паспорт с компасом"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full aspect-square object-cover grayscale shadow-[0_30px_60px_-25px_rgba(120,120,120,0.25)]"
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

      <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto] bg-card border hairline border-border shadow-[0_40px_80px_-30px_rgba(120,120,120,0.15)]">
        {/* Main */}
        <div className="p-10 lg:p-14 relative">
          <div className="flex items-start justify-between border-b hairline border-border pb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground uppercase">
                Wedding Airlines
              </div>
              <div className="font-display text-3xl mt-1">First Class · Boarding Pass</div>
            </div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-graphite uppercase text-right">
              Flight
              <br />
              <span className="text-foreground text-xl tracking-[0.15em]">AF 0626</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8 mt-10">
            {[
              { label: "Пассажир", value: "Уважаемый гость", mono: false },
              { label: "От", value: "TAS · Ташкент" },
              { label: "К", value: "LOV · Любовь" },
              { label: "Дата", value: "26 · 06 · 2026" },
              { label: "Время посадки", value: "15:30" },
              { label: "Церемония", value: "16:00" },
              { label: "Выход", value: "01" },
              { label: "Место", value: "1A" },
              { label: "Класс", value: "First" },
            ].map((f, i) => (
              <div
                key={i}
                className="border-b hairline border-border pb-3 reveal"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
                  {f.label}
                </div>
                <div
                  className={`mt-2 ${f.mono !== false ? "font-mono tracking-[0.1em]" : "font-display text-xl"} text-foreground`}
                >
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="dotted-route flex-1 h-px" />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
              Direct flight · Lago Park
            </span>
            <div className="dotted-route flex-1 h-px" />
          </div>

          <div className="mt-10 flex items-end justify-between">
            <div className="barcode w-2/3 h-14" />
            <div className="text-right">
              <div className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase">
                Confirmation
              </div>
              <div className="font-mono text-sm tracking-[0.25em] mt-1">AF · 260626 · 1A</div>
            </div>
          </div>
        </div>

        {/* Stub */}
        <div className="border-t lg:border-t-0 lg:border-l border-dashed border-border p-10 flex flex-col justify-between min-w-[220px] relative">
          <div className="absolute -top-2 left-1/2 lg:left-auto lg:top-1/2 lg:-left-2 w-4 h-4 rounded-full bg-paper border hairline border-border" />
          <div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
              Stub
            </div>
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
      <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 ${mono ? "font-mono tracking-[0.1em]" : "font-display text-xl"} text-foreground`}
      >
        {value}
      </div>
    </div>
  );
}

function QrCode() {
  // 8x8 stylized QR (decorative, monochrome)
  const cells = [
    "11111110",
    "10000010",
    "10111010",
    "10111010",
    "10111010",
    "10000010",
    "11111110",
    "00000000",
  ];
  return (
    <div className="grid grid-cols-8 gap-[2px] w-24 h-24">
      {cells.flatMap((row, r) =>
        row
          .split("")
          .map((c, i) => (
            <div key={`${r}-${i}`} className={c === "1" ? "bg-foreground" : "bg-transparent"} />
          )),
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
              className="reveal py-4 border-b border-white/10 items-center group hover:bg-white/[0.03] transition flex gap-4 px-4"
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              <div className="font-mono text-lg md:text-xl tracking-[0.1em] whitespace-nowrap w-16 text-white">
                {r.time}
              </div>
              <div className="flex-1 font-display text-base md:text-xl text-white">{r.title}</div>
              <div className="font-mono text-[9px] md:text-sm tracking-[0.2em] text-white/60 w-20">
                {r.code}
              </div>
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
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Координаты
            </div>
            <div className="font-mono text-2xl tracking-[0.15em] mt-2">
              <a
                href="https://maps.app.goo.gl/YFYhZmrHeFZ8zeFXA?g_st=it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-graphite transition"
              >
                Lago Park
              </a>
            </div>
          </div>
          <div className="h-px bg-border" />
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Терминал
            </div>
            <div className="font-display text-4xl mt-2 leading-tight">Lago Park</div>
            <div className="text-graphite mt-3">
              <a
                href="https://maps.app.goo.gl/YFYhZmrHeFZ8zeFXA?g_st=it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        <div className="reveal relative aspect-square border hairline border-border bg-card overflow-hidden">
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
    <div className="relative w-full h-full overflow-hidden bg-gray-200">
      {/* Map background image - using Google Maps Static API */}
      <img src={map} alt="Map background" className="absolute inset-0 w-full h-full object-cover" />

      {/* Overlay SVG for route and plane */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <path id="route" d="M60 80 Q 180 140 245 220" fill="none" />
        </defs>

        {/* dotted route */}
        <path
          className="draw-line"
          d="M60 80 Q 180 140 245 220"
          fill="none"
          stroke="oklch(0.65 0 0)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* origin */}
        <circle cx="60" cy="80" r="5" fill="oklch(0.65 0 0)" />
        <text
          x="70"
          y="78"
          fontSize="10"
          fontFamily="monospace"
          fill="oklch(0.65 0 0)"
          fontWeight="bold"
        >
          START
        </text>

        {/* destination */}
        <g transform="translate(245,220)">
          <circle r="14" fill="none" stroke="oklch(0.65 0 0)" strokeWidth="2" />
          <circle r="6" fill="oklch(0.65 0 0)" />
          <text
            y="32"
            fontSize="10"
            fontFamily="monospace"
            fill="oklch(0.65 0 0)"
            textAnchor="middle"
            fontWeight="bold"
          >
            Lago Park
          </text>
        </g>

        {/* flying plane - CSS animated */}
        <image
          className="animated-plane"
          href={plane}
          x="-12"
          y="-12"
          width="32"
          height="32"
          style={
            {
              offsetPath: 'path("M60 80 Q 180 140 245 220")',
              offsetDistance: "0%",
            } as React.CSSProperties
          }
        />
      </svg>
    </div>
  );
}

/* ---------------- Love Story ---------------- */
function LoveStory() {
  const stamps = [
    {
      year: "2016",
      place: "ТАШКЕНТ",
      note: "Встреча в цирке, где мы оба работали аниматорами — Дед Мороз и Снегурочка. Любовь с первого взгляда.",
    },
    {
      year: "2024",
      place: "ВЬЕТНАМ",
      note: "Первое путешествие вдвоём. Каждый город, каждый момент казался чарованным — мы поняли, что готовы бежать в мир вместе.",
    },
    {
      year: "2024",
      place: "ВЬЕТНАМ",
      note: "На палубе корабля, под звёздами южного неба Вьетнама, я услышал самое важное в жизни «Да».",
    },
    {
      year: "2026",
      place: "LAGO PARK",
      note: "26 июня 2026 года начнется наша главная история — история одной любви, одного дыхания, одной вечности.",
    },
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
            <div
              key={i}
              className="reveal flex flex-col md:flex-row gap-6 md:items-start items-center"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <Stamp text={s.place} year={s.year} />
              <div className="pt-2 text-center md:text-left">
                <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  {s.year} · Visa
                </div>
                <p className="font-display text-2xl leading-snug mt-2">{s.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 pt-10 border-t hairline border-border">
          <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Запись в дневнике
          </div>
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

/* ---------------- Countdown & Calendar ---------------- */
function CountdownAndCalendar() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date("2026-06-26T16:00:00").getTime();
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const weddingDate = new Date("2026-06-26");
  const daysInMonth = new Date(2026, 5, 0).getDate();
  const firstDayOfMonth = new Date(2026, 5, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <section id="countdown" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel index="05" title="Обратный отсчёт" subtitle="Countdown" />

        {/* Countdown */}
        <div className="reveal mt-16 bg-card border hairline border-border p-10 md:p-16 mb-16">
          <div className="text-center mb-8">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
              До момента истины
            </div>
            <div className="grid grid-cols-4 gap-4 md:gap-8">
              <CountdownUnit value={timeLeft.days} label="дней" />
              <CountdownUnit value={timeLeft.hours} label="часов" />
              <CountdownUnit value={timeLeft.minutes} label="минут" />
              <CountdownUnit value={timeLeft.seconds} label="секунд" />
            </div>
          </div>
          <div className="text-center pt-8 border-t hairline border-border">
            <div className="font-display text-2xl md:text-3xl text-graphite">
              26 · 06 · 2026 · 16:00
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="reveal bg-card border hairline border-border p-10 md:p-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
                Июнь
              </div>
              <div className="font-display text-3xl">2026</div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                <div
                  key={day}
                  className="text-center font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Calendar days */}
              {calendarDays.map((day) => (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center relative"
                  style={{ animationDelay: `${(day % 7) * 0.1}s` }}
                >
                  {day === 26 ? (
                    <div className="reveal relative w-full h-full flex items-center justify-center">
                      <svg
                        className="w-full h-full text-foreground"
                        viewBox="0 0 40 40"
                        fill="currentColor"
                      >
                        <path d="M20 35 C 5 25, 0 18, 0 12 C 0 6, 5 2, 9 2 C 13 2, 16 5, 20 9 C 24 5, 27 2, 31 2 C 35 2, 40 6, 40 12 C 40 18, 35 25, 20 35 Z" />
                      </svg>
                      <span className="absolute font-mono text-xs tracking-[0.1em] text-paper font-bold">
                        {String(day).padStart(2, "0")}
                      </span>
                    </div>
                  ) : (
                    <div className="reveal border hairline border-border rounded-sm w-full h-full flex items-center justify-center font-mono text-sm tracking-[0.1em] text-foreground hover:bg-card/50 transition">
                      {String(day).padStart(2, "0")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
              The big day
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-display text-4xl md:text-5xl leading-none mb-2">
        {String(value).padStart(2, "0")}
      </div>
      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* ---------------- Gifts Section ---------------- */
function Gifts() {
  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      <SectionLabel index="05" title="Подарки" subtitle="Gift registry" />

      <div className="reveal mt-16 bg-card border hairline border-border p-10 md:p-16 text-center">
        <p className="font-display text-2xl md:text-3xl leading-relaxed text-graphite mb-6">
          Лучший подарок — это ваше присутствие.
        </p>
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          По приглашению вы уже поняли: у нас две главные страсти — друг к другу и интересные
          приключения. ✈️ Поэтому лучшим подарком будет вклад в наш honeymoon fund. Обещаем
          потратить его максимально романтично и местами безответственно. 🌍
        </p>
      </div>
    </section>
  );
}

/* ---------------- RSVP Form ---------------- */
function FormRow({
  label,
  placeholder,
  type = "text",
  delay = 0,
}: {
  label: string;
  placeholder: string;
  type?: string;
  delay?: number;
}) {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}s` }}>
      <Label>{label}</Label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.05em]"
      />
    </div>
  );
}

function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    ppl: "01",
    att: "yes",
    wishes: "",
    website: "", // Honeypot field
  });

  const isFormValid = formData.name.trim().length > 0 && formData.phone.trim().length > 0;

  // Check localStorage on mount to restore submission state
  useEffect(() => {
    const isSubmitted = localStorage.getItem("rsvp_submitted");
    if (isSubmitted === "true") {
      setSubmitted(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      const attendanceText = formData.att === "yes" ? "Да, лечу" : "К сожалению, нет";

      const payload = {
        name: formData.name,
        phone: formData.phone,
        guests: formData.ppl,
        attendance: attendanceText,
        wishes: formData.wishes || "-",
        website: formData.website, // Honeypot field
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby_OlXQZXkIdORHgNKe6csArZFnfKY_rKugigTwdwyDFsexIBXGou-kshBcm97kwkTn/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success === true) {
        localStorage.setItem("rsvp_submitted", "true");
        setSubmitted(true);
      } else {
        setError(result.error || "Ошибка при отправке формы. Попробуйте позже.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(`Ошибка подключения: ${errorMessage}. Проверьте интернет и попробуйте снова.`);
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionLabel index="05" title="Подтверждение посадки" subtitle="Immigration form" />

        <form
          onSubmit={handleSubmit}
          className="reveal mt-16 bg-card border hairline border-border p-10 md:p-14 space-y-10"
        >
          <div className="flex items-start justify-between border-b hairline border-border pb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
                Form AN-2026
              </div>
              <div className="font-display text-2xl mt-1">Декларация гостя</div>
            </div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground text-right">
              Заполните
              <br />
              печатными буквами
            </div>
          </div>

          {error && (
            <div className="reveal bg-destructive/10 border border-destructive/30 rounded-sm p-4">
              <p className="font-mono text-[10px] tracking-[0.2em] text-destructive">{error}</p>
            </div>
          )}

          <div className="reveal" style={{ animationDelay: "0.5s" }}>
            <Label>Фамилия и имя</Label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="ИВАНОВ ИВАН"
              disabled={submitted}
              className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.05em] disabled:opacity-50"
            />
          </div>

          <div className="reveal" style={{ animationDelay: "1s" }}>
            <Label>Телефон</Label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+998 (90) 000-00-00"
              disabled={submitted}
              className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.05em] disabled:opacity-50"
            />
          </div>

          <div className="reveal" style={{ animationDelay: "1.5s" }}>
            <Label>Количество персон</Label>
            <div className="flex gap-3 mt-3">
              {["01", "02", "03", "04+"].map((n) => (
                <label key={n} className="flex-1">
                  <input
                    type="radio"
                    name="ppl"
                    value={n}
                    checked={formData.ppl === n}
                    onChange={(e) => handleRadioChange("ppl", e.target.value)}
                    disabled={submitted}
                    className="peer sr-only"
                  />
                  <div className="border hairline border-border py-4 text-center font-mono text-sm tracking-[0.2em] cursor-pointer peer-checked:bg-foreground peer-checked:text-paper transition disabled:opacity-50">
                    {n}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ animationDelay: "2s" }}>
            <Label>Подтверждаю присутствие</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {["Да, лечу", "К сожалению, нет"].map((n, i) => (
                <label key={n} className="block">
                  <input
                    type="radio"
                    name="att"
                    value={i === 0 ? "yes" : "no"}
                    checked={formData.att === (i === 0 ? "yes" : "no")}
                    onChange={(e) => handleRadioChange("att", e.target.value)}
                    disabled={submitted}
                    className="peer sr-only"
                  />
                  <div className="border hairline border-border py-4 text-center font-mono text-[11px] tracking-[0.25em] uppercase cursor-pointer peer-checked:bg-foreground peer-checked:text-paper transition disabled:opacity-50">
                    {n}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ animationDelay: "2.5s" }}>
            <Label>Особые пожелания</Label>
            <textarea
              rows={3}
              name="wishes"
              value={formData.wishes}
              onChange={handleInputChange}
              disabled={submitted}
              className="w-full mt-3 bg-transparent border-b hairline border-border focus:border-foreground outline-none py-3 font-mono text-sm tracking-[0.05em] resize-none disabled:opacity-50"
              placeholder="—"
            />
          </div>

          {/* Honeypot anti-spam field - hidden from users */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            style={{ display: "none" }}
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
          />

          <div
            className="pt-6 border-t hairline border-border flex flex-col md:flex-row md:items-center justify-between gap-6 reveal"
            style={{ animationDelay: "3s" }}
          >
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
              Подпись: ___________________ &nbsp; · &nbsp; Дата: 09 · 08 · 2026
            </div>
            <button
              type="submit"
              disabled={!isFormValid || submitted || loading}
              className={`font-mono text-[11px] tracking-[0.4em] uppercase px-10 py-4 transition-colors duration-500 ${
                isFormValid && !submitted && !loading
                  ? "bg-foreground text-paper hover:bg-graphite cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              {loading
                ? "Отправка..."
                : submitted
                  ? "Посадка подтверждена ✓"
                  : "Подтвердить посадку"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------------- Footer -------------- */
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
    <div
      className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 border-b hairline pb-6"
      style={{ borderColor: inverted ? "rgba(255,255,255,0.15)" : undefined }}
    >
      <div className="min-w-0">
        <div
          className={`font-mono text-[9px] md:text-[10px] tracking-[0.35em] md:tracking-[0.4em] uppercase ${inverted ? "text-white/40" : "text-muted-foreground"}`}
        >
          № {index} · {subtitle}
        </div>
        <h2
          className={`font-display text-3xl md:text-5xl lg:text-6xl mt-3 leading-tight md:leading-normal ${inverted ? "text-paper" : ""}`}
        >
          {title}
        </h2>
      </div>
      <div
        className={`hidden md:block font-mono text-[9px] tracking-[0.3em] uppercase ${inverted ? "text-white/40" : "text-muted-foreground"} whitespace-nowrap`}
      >
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
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40">
              Final call
            </div>
            <div className="font-display text-5xl md:text-6xl mt-3 text-paper leading-tight">
              See you on board.
            </div>
            <div className="font-display text-2xl text-white/60 mt-2">
              Фахад &amp; Александра · 2026
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 space-y-1 text-right">
            <div>Wedding Airlines · AF 0626</div>
            <div>TAS → LOV · Gate 01</div>
            <div>26 · 06 · 2026 · 16:00</div>
          </div>
        </div>
        <div className="mt-8 font-mono text-[20px] tracking-[0.4em] text-white/70 text-center">
          <p>
            made with ❤ by{" "}
            <a
              href="https://invito.live"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition"
            >
              invito.live
            </a>
          </p>
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
        <div className="max-w-2xl reveal">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            Издание первое
          </div>
          <h2 className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">
            Каждое путешествие
            <br />
            начинается с документа.
          </h2>
        </div>
      </div>
    </section>
  );
}
