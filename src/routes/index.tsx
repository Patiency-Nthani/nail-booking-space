import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import aboutTech from "@/assets/about-tech.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PTheNailTech's Space — Editorial Nail Studio" },
      {
        name: "description",
        content:
          "Appointment-only nail studio specializing in structured gel manicures, Gel-X extensions, and custom chrome art. Book your session at PTheNailTech's Space.",
      },
      { property: "og:title", content: "PTheNailTech's Space" },
      { property: "og:description", content: "Editorial nail studio. Structured gel, Gel-X, custom art. Book online." },
      { property: "og:image", content: gallery1 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: gallery1 },
    ],
  }),
  component: Index,
});

const services = [
  {
    name: "Structured Gel Overlay",
    desc: "Natural nail strengthening using high-quality builder gel. Includes meticulous cuticle work and solid color polish.",
    duration: "1:30 MINS",
    price: "FROM K100",
  },
  {
    name: "Gel-X Extension",
    desc: "Soft gel extensions for length and durability. Available in short, medium, and long almond or coffin shapes.",
    duration: "2:00 HOURS",
    price: "FROM K160",
  },
  {
    name: "Acrylic Nails",
    desc: "Tiered pricing based on complexity. Includes hand-painted French, 3D textures, and chrome finishes.",
    duration: "2:30 MINS",
    price: "FROM K180",
  },
  {
    name: "Polygel Nails",
    desc: "A hybrid gel-acrylic formula for strong, flexible nails with a natural finish. Lighter than acrylics with the strength of hard gel.",
    duration: "2:30 MINS",
    price: "FROM K180",
  },
];

const gallery = [
  { src: gallery1, label: "Minimalist" },
  { src: gallery2, label: "Chrome Finish" },
  { src: gallery3, label: "Micro French" },
  { src: gallery4, label: "Gold Inlay" },
];

const days = [
  { d: 14, day: "S" },
  { d: 15, day: "M" },
  { d: 16, day: "T" },
  { d: 17, day: "W" },
  { d: 18, day: "T" },
  { d: 19, day: "F" },
  { d: 20, day: "S" },
];
const times = ["08:00", "10:30", "14:00"];

function Index() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedTime, setSelectedTime] = useState<string | null>("12:30 PM");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="font-serif text-xl font-semibold tracking-tight">PTheNailTech</span>
          <div className="flex items-center gap-8">
            <button onClick={() => scrollTo("services")} className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">
              Services
            </button>
            <button onClick={() => scrollTo("gallery")} className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">
              Gallery
            </button>
            <button
              onClick={() => scrollTo("book")}
              className="h-9 bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-colors hover:bg-primary/90"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Now accepting appointments
              </span>
              <h1 className="max-w-[20ch] text-balance font-serif text-5xl font-medium leading-tight tracking-tight md:text-7xl lg:text-8xl">
                The art of the <span className="italic text-muted-foreground">perfect</span> extension.
              </h1>
              <p className="mt-8 max-w-[48ch] text-pretty text-lg text-muted-foreground">
                Specializing in structured gel manicures and high-precision Gel-X extensions for the modern minimalist.
              </p>
              <div className="mt-10">
                <button
                  onClick={() => scrollTo("book")}
                  className="h-12 bg-primary px-8 text-base font-medium text-primary-foreground ring-1 ring-primary transition-colors hover:bg-primary/90"
                >
                  View Availability
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Services */}
        <section id="services" className="bg-secondary/50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-16 text-balance font-serif text-3xl font-medium tracking-tight">Selected Services</h2>
            <div className="grid gap-px bg-border/60 ring-1 ring-black/5">
              {services.map((s) => (
                <div key={s.name} className="group bg-background p-8 transition-colors hover:bg-secondary/40">
                  <div className="flex items-start justify-between gap-6">
                    <div className="max-w-[40ch]">
                      <h3 className="font-sans text-lg font-medium">{s.name}</h3>
                      <p className="mt-2 text-pretty text-sm text-muted-foreground">{s.desc}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <span>{s.duration}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>{s.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => scrollTo("book")}
                      className="shrink-0 text-sm font-semibold underline underline-offset-4 hover:text-accent"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-serif text-3xl font-medium tracking-tight">Portfolio</h2>
              <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                View Instagram
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.map((g) => (
                <figure key={g.label} className="overflow-hidden rounded-xl ring-1 ring-black/5">
                  <img
                    src={g.src}
                    alt={g.label}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-surface-deep py-24 text-background">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <img
                  src={aboutTech}
                  alt="PTheNailTech at her studio"
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full rounded-xl object-cover ring-1 ring-white/5"
                />
              </div>
              <div className="lg:col-span-7">
                <h2 className="text-balance font-serif text-4xl font-medium leading-tight">
                  Modern precision for the discerning hand.
                </h2>
                <p className="mt-8 max-w-[48ch] text-pretty text-lg leading-relaxed text-background/70">
                  PTheNailTech's Space is an appointment-only studio dedicated to the intersection of health and high-end
                  design. Your nails are the ultimate accessory — an expression of personal style that deserves meticulous
                  care and premium products.
                </p>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-background/10 pt-12">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-background/50">Experience</p>
                    <p className="mt-2 font-sans text-xl font-medium">3 YEARS</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-background/50">Location</p>
                    <p className="mt-2 font-sans text-xl font-medium">SALVATION ARMY, GREAT NORTH ROAD LUSAKA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-xl bg-background p-8 ring-1 ring-black/5">
              <h2 className="mb-8 text-center font-serif text-2xl font-medium">Reserve Your Session</h2>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  alert(
                    `Request received for ${fd.get("name")} on April ${selectedDay} at ${selectedTime ?? "—"}.\nWe'll be in touch shortly.`,
                  );
                }}
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Date
                  </label>
                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {days.map((d) => (
                      <div key={d.d} className="flex flex-col items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground/60">{d.day}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedDay(d.d)}
                          className={`flex aspect-square w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            selectedDay === d.d
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {d.d}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Available Times
                  </label>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`h-10 rounded-md text-sm font-medium ring-1 transition-colors ${
                          selectedTime === t
                            ? "bg-primary text-primary-foreground ring-primary"
                            : "ring-border hover:ring-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="h-11 w-full rounded-md bg-background px-3 text-sm ring-1 ring-border outline-none transition-colors focus:ring-foreground"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="h-11 w-full rounded-md bg-background px-3 text-sm ring-1 ring-border outline-none transition-colors focus:ring-foreground"
                      placeholder="+1 555 0123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Service
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="h-11 w-full rounded-md bg-background px-3 text-sm ring-1 ring-border outline-none transition-colors focus:ring-foreground"
                  >
                    {services.map((s) => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-2 h-12 w-full bg-primary text-sm font-medium text-primary-foreground ring-1 ring-primary transition-colors hover:bg-primary/90"
                >
                  Confirm Request
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-serif text-lg font-medium">PTheNailTech's Space</p>
              <p className="mt-2 text-sm text-muted-foreground">Private Studio · Lusaka, Zambia</p>
            </div>
            <div className="flex gap-12">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact</span>
                <a href="mailto:hello@pthenailtech.space" className="text-sm font-medium">
                  hello@pthenailtech.space
                </a>
                <a href="tel:0779109199" className="text-sm font-medium">
                  0779109199
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Social</span>
                <a href="#" className="text-sm font-medium">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <p className="mt-16 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 PTheNailTech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
