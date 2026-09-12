"use client";

import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
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

/** A short scroll film opens the valley and brings the type through depth.
 * The approved composition is the final shot. Short screens and reduced motion
 * keep native flow; the two contact actions are available in every shot.
 */
export function ContactGratitude() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageFits, setStageFits] = useState(false);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  // Use the same compact breakpoint as the Contact camera and navigation.
  const coarsePointer = useMediaQuery("(pointer: coarse), (max-width: 940px)");
  const packageSlug = useServicesContactPackage();
  const bookingHref = calendlyHrefForServicesPackage(site.calendlyUrl, packageSlug);
  const motionEnabled = hydrated && !prefersReducedMotion;
  const pinEnabled = motionEnabled && stageFits;
  const pointerEnabled = motionEnabled && !coarsePointer;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 70, damping: 24, mass: 0.65 });
  const y = useSpring(pointerY, { stiffness: 70, damping: 24, mass: 0.65 });
  const landscapeX = useTransform(x, [-1, 1], [-8, 8]);
  const landscapeY = useTransform(y, [-1, 1], [-6, 6]);
  const headingX = useTransform(x, [-1, 1], [6, -6]);
  const headingY = useTransform(y, [-1, 1], [4, -4]);
  const headingRotateX = useTransform(y, [-1, 1], [-1.5, 1.5]);
  const headingRotateY = useTransform(x, [-1, 1], [2.5, -2.5]);
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
    trackContentSize: true,
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  const scrollYProgress = useTransform(() => pinEnabled
    ? entryProgress.get() * 0.14 + storyProgress.get() * 0.86
    : entryProgress.get());
  // Scroll takes the camera back to its authored path. The pointer springs
  // settle without carrying a stale tilt into the next reading frame.
  useMotionValueEvent(scrollYProgress, "change", () => {
    pointerX.set(0);
    pointerY.set(0);
  });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.6 });
  const pose = useTransform(() => invitationMotionAt(progress.get(), coarsePointer));
  const cameraScale = useTransform(pose, (value) => value.cameraScale);
  const cameraY = useTransform(pose, (value) => value.cameraY);
  const cameraRotate = useTransform(pose, (value) => value.cameraRotate);
  const aperture = useTransform(pose, (value) => `inset(${value.windowTop}% ${value.windowX}% ${value.windowBottom}% ${value.windowX}% round ${value.windowRadius}px)`);
  const thankYouX = useTransform(pose, (value) => value.thankYouX);
  const thankYouY = useTransform(pose, (value) => value.thankYouY);
  const thankYouScale = useTransform(pose, (value) => value.thankYouScale);
  const thankYouRotate = useTransform(pose, (value) => value.thankYouRotate);
  const thankYouRotateY = useTransform(pose, (value) => value.thankYouRotateY);
  const makingRoomX = useTransform(pose, (value) => value.makingRoomX);
  const makingRoomY = useTransform(pose, (value) => value.makingRoomY);
  const makingRoomScale = useTransform(pose, (value) => value.makingRoomScale);
  const makingRoomRotate = useTransform(pose, (value) => value.makingRoomRotate);
  const makingRoomRotateY = useTransform(pose, (value) => value.makingRoomRotateY);
  const noteY = useTransform(pose, (value) => value.noteY);
  const noteOpacity = useTransform(pose, (value) => value.noteOpacity);
  const invitationY = useTransform(pose, (value) => value.invitationY);
  const invitationOpacity = useTransform(pose, (value) => value.invitationOpacity);
  const signatureY = useTransform(pose, (value) => value.signatureY);
  const signatureOpacity = useTransform(pose, (value) => value.signatureOpacity);

  // Never trap tall text or short landscape screens in a sticky viewport.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setStageFits(stage.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  // Hash arrivals and restored pages start at their real position, instead of
  // replaying the entrance from the top of the page after hydration.
  useEffect(() => {
    progress.jump(scrollYProgress.get());
    pointerX.set(0);
    pointerY.set(0);
  }, [hydrated, coarsePointer, motionEnabled, pinEnabled, progress, scrollYProgress, pointerX, pointerY]);

  return (
    <section
      ref={sectionRef}
      id="thanks"
      aria-labelledby="contact-gratitude-heading"
      data-contact-scene="invitation"
      data-contact-gratitude="sunlit"
      data-invitation-motion={motionEnabled ? "full" : "reduced"}
      data-invitation-scroll="reversible"
      data-invitation-pinned={pinEnabled ? "true" : "false"}
      data-invitation-input={coarsePointer ? "compact" : "desktop"}
      className={`${styles.scene} ${invitationItalic.variable}`}
    >
      <div
        ref={stageRef}
        data-contact-invitation-stage
        className={styles.stage}
        onPointerMove={(event) => {
          if (!pointerEnabled || event.pointerType !== "mouse" || event.currentTarget.matches(":focus-within")) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1)));
          pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1)));
        }}
        onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
        onPointerCancel={() => { pointerX.set(0); pointerY.set(0); }}
        onFocusCapture={() => { pointerX.set(0); pointerY.set(0); }}
      >
      <motion.div className={styles.landscape} aria-hidden="true" data-invitation-layer="aperture" style={motionEnabled ? { clipPath: aperture } : { clipPath: "none" }}>
        <motion.div
          data-contact-invitation-camera
          data-invitation-layer="camera"
          className={styles.camera}
          style={motionEnabled ? { scale: cameraScale, y: cameraY, rotate: cameraRotate } : { scale: 1, y: 0, rotate: 0 }}
        >
          <motion.div data-invitation-layer="pointer" className={styles.photograph} style={pointerEnabled ? { x: landscapeX, y: landscapeY } : { x: 0, y: 0 }}>
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
      </motion.div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Before you go</p>
        <motion.h2
          id="contact-gratitude-heading"
          data-invitation-layer="heading-depth"
          className={styles.heading}
          style={pointerEnabled ? { x: headingX, y: headingY, rotateX: headingRotateX, rotateY: headingRotateY } : { x: 0, y: 0, rotateX: 0, rotateY: 0 }}
        >
          <motion.span
            data-invitation-layer="thank-you"
            className={styles.thankYou}
            style={motionEnabled ? { x: thankYouX, y: thankYouY, scale: thankYouScale, rotate: thankYouRotate, rotateY: thankYouRotateY } : { x: 0, y: 0, scale: 1, rotate: 0, rotateY: 0 }}
          >Thank you for</motion.span>{" "}
          <motion.em
            data-invitation-layer="making-room"
            className={styles.makingRoom}
            style={motionEnabled ? { x: makingRoomX, y: makingRoomY, scale: makingRoomScale, rotate: makingRoomRotate, rotateY: makingRoomRotateY } : { x: 0, y: 0, scale: 1, rotate: 0, rotateY: 0 }}
          >making room.</motion.em>
        </motion.h2>
        <motion.div
          data-invitation-layer="note"
          className={styles.acknowledgement}
          style={motionEnabled ? { y: noteY, opacity: noteOpacity } : { y: 0, opacity: 1 }}
        >
          <p>For a question that matters to you.</p>
          <p>For the business you have put so much into.</p>
        </motion.div>
        <motion.p
          data-invitation-layer="invitation"
          className={styles.invitation}
          style={motionEnabled ? { y: invitationY, opacity: invitationOpacity } : { y: 0, opacity: 1 }}
        >
          Bring the part you are still figuring out. <span>I will meet you there.</span>
        </motion.p>
        <motion.p
          data-invitation-layer="signature"
          className={styles.signature}
          style={motionEnabled ? { y: signatureY, opacity: signatureOpacity } : { y: 0, opacity: 1 }}
        >
          <span>Suman Sharma</span>
          <span>Brand strategist</span>
        </motion.p>
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
      </div>
    </section>
  );
}
