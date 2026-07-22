import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingEmail } from "@/lib/send-booking-email.functions";


const gallery1 = "/images/gallery-1.jpg";
const gallery2 = "/images/gallery-2.jpg";
const gallery3 = "/images/gallery-3.jpg";
const gallery4 = "/images/gallery-4.jpg";
const aboutTech = "/images/about-tech.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxe by Patience — Editorial Nail Studio by PTheNailTech" },
      {
        name: "description",
        content:
          "Luxe by Patience — an appointment-only nail studio by PTheNailTech specializing in structured gel manicures, Gel-X extensions, and custom chrome art.",
      },
      { property: "og:title", content: "Luxe by Patience" },
      { property: "og:description", content: "Editorial nail studio. Structured gel, Gel-X, custom art. Book online." },
      { property: "og:image", content: gallery1 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: gallery1 },
    ],
  }),
  component: Index,
});

const serviceGel = "/images/gallery-1.jpg";
const serviceGelX = "/images/gallery-2.jpg";
const serviceAcrylic = "/images/gallery-3.jpg";
const servicePolygel = "/images/gallery-4.jpg";
const gelx1 = { url: "/images/gelx-1.jpeg" };
const gelx2 = { url: "/images/gelx-2.jpeg" };
const gelx3 = { url: "/images/gelx-3.jpeg" };
const gelx4 = { url: "/images/gelx-4.jpeg" };
const sgo1 = { url: "/images/sgo-1.jpeg" };
const sgo2 = { url: "/images/sgo-2.jpeg" };
const sgo3 = { url: "/images/sgo-3.jpeg" };
const sgo4 = { url: "/images/sgo-4.jpeg" };
const poly1 = { url: "/images/poly-1.jpeg" };
const poly2 = { url: "/images/poly-2.jpeg" };
const poly3 = { url: "/images/poly-3.jpeg" };
const poly4 = { url: "/images/poly-4.jpeg" };
const acrylic1 = { url: "/images/acrylic-1.jpeg" };
const acrylic2 = { url: "/images/acrylic-2.jpeg" };
const acrylic3 = { url: "/images/acrylic-3.jpeg" };
const acrylic4 = { url: "/images/acrylic-4.jpeg" };


const services = [
  {
    name: "Structured Gel Overlay",
    desc: "Natural nail strengthening using high-quality builder gel. Includes meticulous cuticle work and solid color polish.",
    duration: "1:30 MINS",
    price: "FROM K100",
    images: [sgo1.url, sgo2.url, sgo3.url, sgo4.url],
  },
  {
    name: "Gel-X Extension",
    desc: "Soft gel extensions for length and durability. Available in short, medium, and long almond or coffin shapes.",
    duration: "2:00 HOURS",
    price: "FROM K160",
    images: [gelx1.url, gelx2.url, gelx3.url, gelx4.url],
  },
  {
    name: "Acrylic Nails",
    desc: "Tiered pricing based on complexity. Includes hand-painted French, 3D textures, and chrome finishes.",
    duration: "2:30 MINS",
    price: "FROM K180",
    images: [acrylic1.url, acrylic2.url, acrylic3.url, acrylic4.url],
  },
  {
    name: "Polygel Nails",
    desc: "A hybrid gel-acrylic formula for strong, flexible nails with a natural finish. Lighter than acrylics with the strength of hard gel.",
    duration: "2:30 MINS",
    price: "FROM K180",
    images: [poly1.url, poly2.url, poly3.url, poly4.url],
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
const times = ["08:00", "10:30", "14:00", "17:30"];

const BOOKINGS_KEY = "pthenailtech.bookings.v1";

function Index() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, true>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Load existing bookings from localStorage (client-only to avoid SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_KEY);
      if (raw) setBookedSlots(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const slotKey = (day: number, time: string) => `${day}|${time}`;
  const isBooked = (day: number, time: string) => Boolean(bookedSlots[slotKey(day, time)]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const bookingSchema = z.object({
    name: z.string().trim().min(2, "Please enter your full name").max(100),
    email: z.string().trim().email("Please enter a valid email").max(255),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number")
      .max(20)
      .regex(/^[0-9+\s()-]+$/, "Phone may only contain digits and + ( ) -"),
    service: z.string().min(1, "Select a service"),
  });


  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-semibold tracking-tight">Luxe by Patience</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">by PTheNailTech</span>
          </div>
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
                The art of <span className="italic">perfect</span> extensions.
              </h1>
              <p className="mt-8 max-w-[52ch] text-pretty text-lg text-muted-foreground">
                Thoughtfully crafted structured gel overlays, gel-X, Acrylic and Polygel Extensions for those who appreciate the details.
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
            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.name} className="group overflow-hidden rounded-xl bg-background ring-1 ring-foreground/5 transition-colors hover:bg-secondary/40">
                  <div className="grid grid-cols-2 gap-1">
                    {s.images.map((img, i) => (
                      <div key={i} className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={img}
                          alt={`${s.name} ${i + 1}`}
                          loading="lazy"
                          onClick={() => setLightboxImage(img)}
                          className="h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-sans text-lg font-medium">{s.name}</h3>
                        <p className="mt-2 text-pretty text-sm text-muted-foreground">{s.desc}</p>
                        <div className="mt-4 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <span>{s.duration}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{s.price}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => scrollTo("book")}
                      className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-primary transition-colors hover:bg-primary/90"
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
                <figure key={g.label} className="overflow-hidden rounded-xl ring-1 ring-foreground/5">
                  <img
                    src={g.src}
                    alt={g.label}
                    loading="lazy"
                    width={800}
                    height={800}
                    onClick={() => setLightboxImage(g.src)}
                    className="aspect-square w-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-surface-deep py-24 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <img
                  src={aboutTech}
                  alt="PTheNailTech at her studio"
                  loading="lazy"
                  width={800}
                  height={1000}
                  onClick={() => setLightboxImage(aboutTech)}
                  className="aspect-[4/5] w-full cursor-pointer rounded-xl object-cover ring-1 ring-white/10"
                />
              </div>
              <div className="lg:col-span-7">
                <h2 className="text-balance font-serif text-4xl font-medium leading-tight">
                  Modern precision for the discerning hand.
                </h2>
                <p className="mt-8 max-w-[48ch] text-pretty text-lg leading-relaxed text-white/70">
                  PTheNailTech's Space is an appointment-only studio dedicated to the intersection of health and high-end
                  design. Your nails are the ultimate accessory — an expression of personal style that deserves meticulous
                  care and premium products.
                </p>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-background/10 pt-12">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/50">Experience</p>
                    <p className="mt-2 font-sans text-xl font-medium">3 YEARS</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/50">Location</p>
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
            <div className="rounded-xl bg-background p-8 ring-1 ring-foreground/5">
              <h2 className="mb-8 text-center font-serif text-2xl font-medium">Reserve Your Session</h2>
              <form
                className="space-y-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (submitting) return;
                  const form = e.currentTarget;
                  const fd = new FormData(form);
                  const parsed = bookingSchema.safeParse({
                    name: String(fd.get("name") ?? ""),
                    email: String(fd.get("email") ?? ""),
                    phone: String(fd.get("phone") ?? ""),
                    service: String(fd.get("service") ?? ""),
                  });
                  if (!parsed.success) {
                    toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
                    return;
                  }
                  if (!selectedTime) {
                    toast.error("Please choose a preferred time");
                    return;
                  }
                  if (isBooked(selectedDay, selectedTime)) {
                    toast.error("That slot was just booked", {
                      description: "Please pick another available time.",
                    });
                    setSelectedTime(null);
                    return;
                  }
                  setSubmitting(true);
                  const now = new Date();
                  const bookingDate = new Date(now.getFullYear(), now.getMonth(), selectedDay)
                    .toISOString()
                    .slice(0, 10);
                  const { error } = await supabase.from("bookings").insert({
                    customer_name: parsed.data.name,
                    customer_email: parsed.data.email,
                    customer_phone: parsed.data.phone,
                    service: parsed.data.service,
                    booking_date: bookingDate,
                    booking_time: selectedTime,
                  });
                  if (error) {
                    setSubmitting(false);
                    toast.error("Could not save your booking", { description: error.message });
                    return;
                  }
                  const key = slotKey(selectedDay, selectedTime);
                  const next = { ...bookedSlots, [key]: true as const };
                  setBookedSlots(next);
                  try {
                    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
                  } catch {
                    // storage unavailable — booking still tracked in-session
                  }
                  setSubmitting(false);
                  form.reset();
                  setSelectedTime(null);
                  toast.success("Booking confirmed", {
                    description: `${parsed.data.name} · ${parsed.data.service} · ${bookingDate} at ${selectedTime}. We'll be in touch on ${parsed.data.phone}.`,
                  });
                  try {
                    await sendBookingEmail({
                      data: {
                        name: parsed.data.name,
                        email: parsed.data.email,
                        phone: parsed.data.phone,
                        service: parsed.data.service,
                        bookingDate,
                        bookingTime: selectedTime,
                      },
                    });
                  } catch (err) {
                    console.error("Failed to send booking notification email", err);
                  }
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
                          onClick={() => {
                            setSelectedDay(d.d);
                            setSelectedTime(null);
                          }}
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
                    {times.map((t) => {
                      const booked = isBooked(selectedDay, t);
                      const selected = selectedTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={booked}
                          aria-disabled={booked}
                          title={booked ? "Unavailable — already booked" : undefined}
                          onClick={() => !booked && setSelectedTime(t)}
                          className={`relative h-10 rounded-md text-sm font-medium ring-1 transition-colors ${
                            booked
                              ? "cursor-not-allowed bg-muted text-muted-foreground line-through ring-border opacity-60"
                              : selected
                                ? "bg-primary text-primary-foreground ring-primary"
                                : "ring-border hover:ring-foreground"
                          }`}
                        >
                          {t}
                          {booked && (
                            <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {times.every((t) => isBooked(selectedDay, t)) ? (
                    <p className="mt-3 text-xs text-destructive">
                      All times for day {selectedDay} are booked. Please pick another date.
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Greyed-out times are already booked — please choose an available slot.
                    </p>
                  )}
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
                      placeholder="+260 779 109 199"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-11 w-full rounded-md bg-background px-3 text-sm ring-1 ring-border outline-none transition-colors focus:ring-foreground"
                    placeholder="jane@example.com"
                  />
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
                  disabled={submitting}
                  className="mt-2 h-12 w-full bg-primary text-sm font-medium text-primary-foreground ring-1 ring-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Confirm Request"}
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
                <a href="tel:+260779109199" className="text-sm font-medium">
                  +260 779 109 199
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
