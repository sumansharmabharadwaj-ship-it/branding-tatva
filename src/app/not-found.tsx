import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-28 text-center">
          <Container>
            <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">404</p>
            <h1 className="mt-3 text-display-lg font-display font-semibold text-soil">
              This page hasn&apos;t found its shape yet.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
              The page you&apos;re looking for doesn&apos;t exist, or has moved.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <LinkButton href="/">Back to home</LinkButton>
              <LinkButton href="/contact" variant="secondary">Contact</LinkButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
