"use client";

import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useServicesContactPackage } from "@/hooks/useServicesContactPackage";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";
import { invitationMotionAt } from "@/lib/contactInvitationMotion";
import { site } from "@/data/site";
import styles from "./ContactGratitude.module.css";

const invitationItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-invitation-italic",
  display: "swap",
});

/** Preserve the selected composition, then let native scroll open it.
 * Landscape, headline and personal note share a reversible arrival. The
 * actions stay outside moving wrappers: no pin, timer or completion gate.
 */
export function ContactGratitude() {
  const sectionRef = useRef<HTMLElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const coarsePointer = useMediaQuery("(pointer: coarse), (max-width: 767px)");
  const packageSlug = useServicesContactPackage();
  const bookingHref = calendlyHrefForServicesPackage(site.calendlyUrl, packageSlug);
  const motionEnabled = hydrated && !prefersReducedMotion;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 44, damping: 22, mass: 0.8 });
  const y = useSpring(pointerY, { stiffness: 44, damping: 22, mass: 0.8 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    trackContentSize: true,
  });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.6 });
  const pose = useTransform(() => invitationMotionAt(progress.get(), coarsePointer));
  const cameraScale = useTransform(pose, (value) => value.cameraScale);
  const cameraY = useTransform(pose, (value) => value.cameraY);
  const thankYouX = useTransform(pose, (value) => value.thankYouX);
  const thankYouY = useTransform(pose, (value) => value.thankYouY);
  const makingRoomX = useTransform(pose, (value) => value.makingRoomX);
  const makingRoomY = useTransform(pose, (value) => value.makingRoomY);
  const makingRoomScale = useTransform(pose, (value) => value.makingRoomScale);
  const noteY = useTransform(pose, (value) => value.noteY);

  // Hash arrivals and restored pages start at their real position, instead of
  // replaying the entrance from the top of the page after hydration.
  useEffect(() => {
    progress.jump(scrollYProgress.get());
    pointerX.set(0);
    pointerY.set(0);
  }, [hydrated, coarsePointer, motionEnabled, progress, scrollYProgress, pointerX, pointerY]);

  return (
    <section
      ref={sectionRef}
      id="thanks"
      aria-labelledby="contact-gratitude-heading"
      data-contact-scene="invitation"
      data-contact-gratitude="sunlit"
      data-invitation-motion={motionEnabled ? "full" : "reduced"}
      data-invitation-scroll="reversible"
      data-invitation-input={coarsePointer ? "compact" : "desktop"}
      className={`${styles.scene} ${invitationItalic.variable}`}
      onPointerMove={(event) => {
        if (!motionEnabled || coarsePointer || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
        pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
      onFocusCapture={() => { pointerX.set(0); pointerY.set(0); }}
    >
      <div className={styles.landscape} aria-hidden="true">
        <motion.div
          data-contact-invitation-camera
          data-invitation-layer="camera"
          className={styles.camera}
          style={motionEnabled ? { scale: cameraScale, y: cameraY } : { scale: 1, y: 0 }}
        >
          <motion.div data-invitation-layer="pointer" className={styles.photograph} style={motionEnabled && !coarsePointer ? { x, y } : { x: 0, y: 0 }}>
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/generated/bt-contact-sunlit-invitation-mobile-v1.webp" />
              <Image
                src="/images/generated/bt-contact-sunlit-invitation-v1.webp"
                alt=""
                fill
                sizes="100vw"
                className={styles.image}
              />
            </picture>
          </motion.div>
        </motion.div>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Before you go</p>
        <h2 id="contact-gratitude-heading" className={styles.heading}>
          <motion.span
            data-invitation-layer="thank-you"
            className={styles.thankYou}
            style={motionEnabled ? { x: thankYouX, y: thankYouY } : { x: 0, y: 0 }}
          >Thank you for</motion.span>{" "}
          <motion.em
            data-invitation-layer="making-room"
            className={styles.makingRoom}
            style={motionEnabled ? { x: makingRoomX, y: makingRoomY, scale: makingRoomScale } : { x: 0, y: 0, scale: 1 }}
          >making room.</motion.em>
        </h2>
        <motion.div
          data-invitation-layer="note"
          className={styles.acknowledgement}
          style={motionEnabled ? { y: noteY } : { y: 0 }}
        >
          <p>For a question that matters to you.</p>
          <p>For the business you have put so much into.</p>
        </motion.div>
        <p className={styles.invitation}>
          Bring the part you are still figuring out. <span>I will meet you there.</span>
        </p>
        <p className={styles.signature}>
          <span>Suman Sharma</span>
          <span>Brand strategist</span>
        </p>
        <div data-contact-invitation-actions className={styles.actions}>
          <TrackedLink
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Find a time with Suman, opens Calendly in a new tab"
            event="calendar_opened"
            eventProps={{ source: "contact_gratitude", ...(packageSlug ? { package: packageSlug } : {}) }}
            data-contact-invitation-booking
            className={styles.booking}
          >
            <span>Find a time with Suman</span>
            <ArrowRight aria-hidden="true" size={20} strokeWidth={1.4} />
          </TrackedLink>
          <p className={styles.reassurance}>
            <span>{site.consultationMinutes} minute conversation</span>
            <span aria-hidden="true" className={styles.dot}> · </span>
            <span>Bring the question as it stands</span>
          </p>
          <TrackedLink
            href="#write"
            event="contact_route_selected"
            eventProps={{ source: "contact_gratitude", route: "write" }}
            data-contact-invitation-write
            className={styles.write}
          >
            I would rather write
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
