"use client";

import { useEffect } from "react";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pb-28 pt-36 text-center sm:pt-40">
          <Container>
            <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
              Something went wrong
            </p>
            <h1 className="mt-3 text-display-lg font-display font-normal text-soil">
              That loaded differently than it should have.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
              Nothing on your end went wrong. Try again, or head back to the
              homepage.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={reset}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-action-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-earth hover:bg-action-primary-hover hover:-translate-y-0.5 hover:shadow-elevation-lg focus-ring-halo"
              >
                Try again
              </button>
              <LinkButton href="/" variant="secondary">
                Back to home
              </LinkButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
