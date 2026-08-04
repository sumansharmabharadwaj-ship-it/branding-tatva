"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { elements } from "@/data/elements";
import { ELEMENT_HEX } from "@/lib/sectionWash";

const TATVAS: { slug: keyof typeof ELEMENT_HEX; name: string; role: string; line: string }[] = [
  { slug: "earth", name: "Prithvi", role: "The Foundation", line: "The strategic truth everything else stands on." },
  { slug: "water", name: "Jal", role: "The Flow", line: "The experience that makes every touchpoint feel related." },
  { slug: "fire", name: "Agni", role: "The Spark", line: "The distinct expression that earns attention." },
  { slug: "air", name: "Vayu", role: "The Voice", line: "The language people carry beyond the room." },
  { slug: "space", name: "Akash", role: "The Space", line: "The consistency that turns exposure into memory." },
];

export function TatvaStrip() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: "#F2F0E8" }}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-[18%] h-80 w-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.13), transparent 68%)" }}
        animate={prefersReducedMotion ? undefined : { x: [0, 44, 0], y: [0, 28, 0], scale: [1, 1.12, 1] }}
        transition={prefersReducedMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-[8%] h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(85,107,74,0.14), transparent 68%)" }}
        animate={prefersReducedMotion ? undefined : { x: [0, -52, 0], y: [0, -24, 0], scale: [1.04, 0.94, 1.04] }}
        transition={prefersReducedMotion ? undefined : { duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative max-w-[100rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "#556B4A" }}>
              The framework
            </p>
            <h2 className="mt-3 font-display text-display-sm font-normal leading-[1.08] text-soil">
              The five Tatvas behind every brand people remember.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground-secondary">
              One living system: what the brand stands on, how it moves, how it speaks, and what remains.
            </p>
            <Link
              href="#elements"
              className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em]"
              style={{ color: "#556B4A" }}
            >
              Explore the living system <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-2">
              {TATVAS.map((tatva, index) => {
                const element = elements.find((entry) => entry.slug === tatva.slug);
                const direction = index % 2 === 0 ? 1 : -1;

                return (
                  <motion.li
                    key={tatva.slug}
                    className="flex items-start lg:flex-1"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.42 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href="#elements" className="group flex w-full flex-col items-center text-center">
                      <motion.span
                        className="relative block h-24 w-24 lg:h-28 lg:w-28"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                y: [0, -8 - index * 0.7, 0],
                                rotate: [0, direction * 1.6, 0],
                              }
                        }
                        transition={
                          prefersReducedMotion
                            ? undefined
                            : {
                                duration: 5.8 + index * 0.7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.35,
                              }
                        }
                      >
                        <motion.span
                          aria-hidden="true"
                          className="absolute -inset-3 rounded-full border border-dashed"
                          style={{ borderColor: `${ELEMENT_HEX[tatva.slug]}66` }}
                          animate={prefersReducedMotion ? undefined : { rotate: direction * 360 }}
                          transition={prefersReducedMotion ? undefined : { duration: 17 + index * 2, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.span
                          aria-hidden="true"
                          className="absolute -inset-4 rounded-full"
                          animate={prefersReducedMotion ? undefined : { rotate: direction * -360 }}
                          transition={prefersReducedMotion ? undefined : { duration: 11 + index * 1.4, repeat: Infinity, ease: "linear" }}
                        >
                          <span
                            className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                            style={{
                              backgroundColor: ELEMENT_HEX[tatva.slug],
                              boxShadow: `0 0 14px ${ELEMENT_HEX[tatva.slug]}88`,
                            }}
                          />
                        </motion.span>

                        <span
                          className="absolute inset-0 overflow-hidden rounded-full ring-2 ring-offset-2 transition-transform duration-500 group-hover:scale-[1.08]"
                          style={{
                            ["--tw-ring-color" as string]: `${ELEMENT_HEX[tatva.slug]}66`,
                            ["--tw-ring-offset-color" as string]: "#F2F0E8",
                          }}
                        >
                          {element?.image && (
                            <motion.span
                              className="absolute inset-0"
                              animate={
                                prefersReducedMotion
                                  ? undefined
                                  : {
                                      scale: [1.03, 1.13, 1.03],
                                      x: [0, direction * 5, 0],
                                      y: [0, -3, 0],
                                    }
                              }
                              transition={
                                prefersReducedMotion
                                  ? undefined
                                  : {
                                      duration: 8 + index,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }
                              }
                            >
                              <Image src={element.image} alt="" fill sizes="112px" className="object-cover" />
                            </motion.span>
                          )}
                          <motion.span
                            aria-hidden="true"
                            className="absolute -inset-y-3 -left-1/2 w-1/3 rotate-12 bg-white/20 blur-md"
                            animate={prefersReducedMotion ? undefined : { x: ["0%", "520%"] }}
                            transition={
                              prefersReducedMotion
                                ? undefined
                                : {
                                    duration: 3.8,
                                    repeat: Infinity,
                                    repeatDelay: 2.2 + index * 0.45,
                                    ease: "easeInOut",
                                    delay: index * 0.5,
                                  }
                            }
                          />
                        </span>
                      </motion.span>

                      <span className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-soil">{tatva.name}</span>
                      <span className="mt-1 font-display text-base font-normal" style={{ color: ELEMENT_HEX[tatva.slug] }}>
                        {tatva.role}
                      </span>
                      <span className="mt-1 max-w-[11rem] text-xs leading-relaxed text-foreground-secondary">
                        {tatva.line}
                      </span>
                    </Link>

                    {index < TATVAS.length - 1 && (
                      <span aria-hidden="true" className="relative mt-14 hidden h-px flex-1 lg:block">
                        <motion.span
                          className="absolute inset-0 origin-left border-t border-dashed"
                          style={{ borderColor: "#B5B3AA" }}
                          initial={prefersReducedMotion ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.7 }}
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, delay: 0.35 + index * 0.12 }}
                        />
                        <motion.span
                          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sandstone"
                          animate={prefersReducedMotion ? undefined : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                          transition={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  duration: 2.4,
                                  repeat: Infinity,
                                  repeatDelay: 1.2,
                                  ease: "easeInOut",
                                  delay: index * 0.35,
                                }
                          }
                        />
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
