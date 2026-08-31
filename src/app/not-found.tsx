import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pb-28 pt-36 text-center sm:pt-40">
          <Container>
            <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">404</p>
            <h1 className="mt-3 text-display-lg font-display font-normal text-soil">
              That address does not lead to a page.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
              The page may have moved, or the address may be incomplete.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <LinkButton href="/">Go to the homepage</LinkButton>
              <LinkButton href="/contact" variant="secondary">Ask Suman</LinkButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
