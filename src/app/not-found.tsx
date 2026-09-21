import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

// A missing page is a fork, never a dead end: the two actions cover the
// visitor who wants to start over and the one who wants an answer, and
// the quiet room list underneath catches everyone in between.
const ROOMS = [
  { href: "/services", label: "The work", detail: "What gets decided, built, and proven" },
  { href: "/services#proof", label: "The evidence", detail: "Recorded results from real engagements" },
  { href: "/insights", label: "The essays", detail: "Branding thinking worth disagreeing with" },
  { href: "/glossary", label: "The vocabulary", detail: "Branding terms, defined plainly" },
] as const;

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pb-28 pt-36 text-center sm:pt-40">
          <Container>
            <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">404</p>
            <h1 className="mt-3 text-display-lg font-display font-normal text-soil">
              That address leads nowhere.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
              The page may have moved, or the address may be incomplete. The rooms below are all real.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <LinkButton href="/">Go to the homepage</LinkButton>
              <LinkButton href="/contact" variant="secondary">Ask Suman</LinkButton>
            </div>
            <nav aria-label="Places worth going instead" className="mx-auto mt-12 max-w-2xl text-left">
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {ROOMS.map((room) => (
                  <li key={room.href}>
                    <Link
                      href={room.href}
                      className="group flex min-h-12 flex-col justify-center border-b border-soil/10 py-3 transition-colors duration-200 hover:border-soil/30"
                    >
                      <span className="text-sm font-medium text-soil transition-colors duration-200 group-hover:text-clay">
                        {room.label}
                      </span>
                      <span className="text-xs text-foreground-secondary">{room.detail}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
