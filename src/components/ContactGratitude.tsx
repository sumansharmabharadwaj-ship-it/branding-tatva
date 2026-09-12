"use client";

import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useServicesContactPackage } from "@/hooks/useServicesContactPackage";
import { calendlyHrefForServicesPackage } from "@/lib/servicesJourney";
import { invitationBotanyAt, invitationLetterAt, invitationMomentumAt, invitationMotionAt } from "@/lib/contactInvitationMotion";
import { site } from "@/data/site";
import styles from "./ContactGratitude.module.css";

const invitationItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-invitation-italic",
  display: "swap",
});

const botanicalImage = "/images/generated/bt-contact-botanical-foreground-v1.webp";
const frameShape = "M76 18H380Q396 18 404 30L412 40Q420 50 438 50H562Q580 50 588 40L596 30Q604 18 620 18H924Q944 18 954 36L974 64Q984 78 984 100V700Q984 722 970 736L950 758Q938 780 916 780H624Q606 780 596 766L588 756Q580 746 562 746H438Q420 746 412 756L404 766Q394 780 376 780H84Q62 780 50 758L30 736Q16 722 16 700V100Q16 78 26 64L46 36Q56 18 76 18Z";

function UnfoldingLetter({ letter, index, progress, enabled, compact }: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
  enabled: boolean;
  compact: boolean;
}) {
  const pose = useTransform(() => invitationLetterAt(progress.get(), index, compact));
  const y = useTransform(pose, (value) => value.y);
  const rotateX = useTransform(pose, (value) => value.rotateX);
  const rotate = useTransform(pose, (value) => value.rotate);
  return <motion.span data-invitation-glyph className={styles.letter} style={enabled ? { y, rotateX, rotate } : { y: 0, rotateX: 0, rotate: 0 }}>{letter}</motion.span>;
}

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
  const foregroundX = useTransform(x, [-1, 1], [-24, 24]);
  const foregroundY = useTransform(y, [-1, 1], [-14, 14]);
  const headingX = useTransform(x, [-1, 1], [6, -6]);
  const headingY = useTransform(y, [-1, 1], [4, -4]);
  const headingRotateX = useTransform(y, [-1, 1], [-1.5, 1.5]);
  const headingRotateY = useTransform(x, [-1, 1], [2.5, -2.5]);
  // Only the ink follows the pointer: the link and its label keep a stable
  // hit area, including along the lower edge of the button.
  const inkTargetX = useMotionValue(0);
  const inkTargetY = useMotionValue(0);
  const inkX = useSpring(inkTargetX, { stiffness: 150, damping: 24, mass: 0.65 });
  const inkY = useSpring(inkTargetY, { stiffness: 150, damping: 24, mass: 0.65 });
  const inkRotate = useTransform(inkX, [-6, 6], [-2, 2]);
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
    inkTargetX.set(0);
    inkTargetY.set(0);
  });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.6 });
  // Near foliage carries a little more weight than the distant camera. Both
  // springs are overdamped so quick direction changes cannot produce a loop.
  const canopyProgress = useSpring(scrollYProgress, { stiffness: 92, damping: 22, mass: 0.85 });
  const scrollVelocity = useVelocity(scrollYProgress);
  const flexTarget = useTransform(scrollVelocity, [-1.6, 0, 1.6], [-1, 0, 1]);
  const flex = useSpring(flexTarget, { stiffness: 100, damping: 24, mass: 0.65 });
  const momentum = useTransform(() => invitationMomentumAt(progress.get(), flex.get(), coarsePointer));
  const pose = useTransform(() => invitationMotionAt(progress.get(), coarsePointer));
  const cameraScale = useTransform(pose, (value) => value.cameraScale);
  const cameraX = useTransform(pose, (value) => value.cameraX);
  const cameraY = useTransform(pose, (value) => value.cameraY);
  const cameraRotate = useTransform(pose, (value) => value.cameraRotate);
  const aperture = useTransform(pose, (value) => {
    const radius = value.windowRadius;
    return `inset(${value.windowTop}% ${value.windowX}% ${value.windowBottom}% ${value.windowX}% round ${radius * 1.6}px ${radius * 0.42}px ${radius * 1.35}px ${radius * 0.55}px)`;
  });
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
  const firstNoteClip = useTransform(pose, (value) => `inset(0 ${value.firstNoteClip}% 0 0)`);
  const secondNoteClip = useTransform(pose, (value) => `inset(0 ${value.secondNoteClip}% 0 0)`);
  const invitationY = useTransform(pose, (value) => value.invitationY);
  const invitationOpacity = useTransform(pose, (value) => value.invitationOpacity);
  const signatureY = useTransform(pose, (value) => value.signatureY);
  const signatureOpacity = useTransform(pose, (value) => value.signatureOpacity);
  const bookingOrbit = useTransform(pose, (value) => value.bookingOrbit);
  const botany = useTransform(() => invitationBotanyAt(canopyProgress.get()));
  const botanicalLeftX = useTransform(botany, (value) => `${value.leftX}%`);
  const botanicalRightX = useTransform(botany, (value) => `${value.rightX}%`);
  const botanicalLeftY = useTransform(() => botany.get().leftY + momentum.get().leftY);
  const botanicalRightY = useTransform(() => botany.get().rightY + momentum.get().rightY);
  const botanicalScale = useTransform(botany, (value) => value.scale);
  const botanicalLeftRotate = useTransform(() => botany.get().leftRotate + momentum.get().leftRotate);
  const botanicalRightRotate = useTransform(() => botany.get().rightRotate + momentum.get().rightRotate);
  const botanicalOpacity = useTransform(botany, (value) => value.opacity);
  const frameDraw = useTransform(() => invitationBotanyAt(progress.get()).frame);

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
    canopyProgress.jump(scrollYProgress.get());
    flex.jump(0);
    pointerX.set(0);
    pointerY.set(0);
    inkTargetX.set(0);
    inkTargetY.set(0);
  }, [hydrated, coarsePointer, motionEnabled, pinEnabled, progress, canopyProgress, flex, scrollYProgress, pointerX, pointerY, inkTargetX, inkTargetY]);

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
      data-invitation-art="botanical-passage"
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
          style={motionEnabled ? { scale: cameraScale, y: cameraY, rotate: cameraRotate, x: cameraX } : { scale: 1, y: 0, rotate: 0, x: 0 }}
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

      <svg className={styles.paperFrame} viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={`M0 0H1000V800H0Z ${frameShape}`} fillRule="evenodd" className={styles.paperEdge} />
        <motion.path d={frameShape} fill="none" vectorEffect="non-scaling-stroke" className={styles.frameLine} style={{ pathLength: motionEnabled ? frameDraw : 1 }} />
      </svg>

      <motion.div aria-hidden="true" data-invitation-layer="foreground-pointer" className={styles.botanicalForeground} style={pointerEnabled ? { x: foregroundX, y: foregroundY } : { x: 0, y: 0 }}>
        <motion.div data-invitation-botany="left" className={`${styles.botanicalSide} ${styles.botanicalLeft}`} style={motionEnabled ? { x: botanicalLeftX, y: botanicalLeftY, scale: botanicalScale, rotate: botanicalLeftRotate, opacity: botanicalOpacity } : { x: "-78%", y: 32, scale: 1.15, rotate: -8, opacity: 0.76 }}>
          <Image src={botanicalImage} alt="" fill unoptimized className={styles.botanicalImage} sizes="40vw" />
        </motion.div>
        <motion.div data-invitation-botany="right" className={`${styles.botanicalSide} ${styles.botanicalRight}`} style={motionEnabled ? { x: botanicalRightX, y: botanicalRightY, scale: botanicalScale, rotate: botanicalRightRotate, opacity: botanicalOpacity } : { x: "78%", y: 32, scale: 1.15, rotate: 8, opacity: 0.76 }}>
          <Image src={botanicalImage} alt="" fill unoptimized className={styles.botanicalImage} sizes="40vw" />
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
          >
            <span className={styles.accessibleText}>making room.</span>
            <span aria-hidden="true" className={styles.letterLine}>
              <span className={styles.word}>{Array.from("making").map((letter, index) => <UnfoldingLetter key={index} letter={letter} index={index} progress={progress} enabled={motionEnabled} compact={coarsePointer} />)}</span>{" "}
              <span className={styles.word}>{Array.from("room.").map((letter, index) => <UnfoldingLetter key={index} letter={letter} index={index + 6} progress={progress} enabled={motionEnabled} compact={coarsePointer} />)}</span>
            </span>
          </motion.em>
        </motion.h2>
        <motion.div
          data-invitation-layer="note"
          className={styles.acknowledgement}
          style={motionEnabled ? { y: noteY } : { y: 0 }}
        >
          <motion.p data-invitation-layer="note-first" style={{ clipPath: motionEnabled ? firstNoteClip : "none" }}>For a question that matters to you.</motion.p>
          <motion.p data-invitation-layer="note-second" style={{ clipPath: motionEnabled ? secondNoteClip : "none" }}>For the business you have put so much into.</motion.p>
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
            onPointerMove={(event) => {
              if (!pointerEnabled || event.pointerType !== "mouse" || event.currentTarget.matches(":focus-visible")) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              inkTargetX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1)) * 6);
              inkTargetY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1)) * 4);
            }}
            onPointerLeave={() => { inkTargetX.set(0); inkTargetY.set(0); }}
            onPointerCancel={() => { inkTargetX.set(0); inkTargetY.set(0); }}
            onFocus={() => { inkTargetX.set(0); inkTargetY.set(0); }}
          >
            <span className={styles.bookingFill} aria-hidden="true" />
            <motion.span data-invitation-orbit className={styles.bookingOrbitPointer} aria-hidden="true" style={pointerEnabled ? { x: inkX, y: inkY, rotate: inkRotate } : { x: 0, y: 0, rotate: 0 }}>
              <svg className={styles.bookingOrbit} viewBox="0 0 400 76" preserveAspectRatio="none" focusable="false">
                <motion.path d="M22 40C14 13 112 3 214 8C330 9 383 19 383 37C386 58 295 72 191 68C90 67 13 60 16 39C18 17 104 4 200 6" fill="none" vectorEffect="non-scaling-stroke" style={{ pathLength: motionEnabled ? bookingOrbit : 1 }} />
              </svg>
            </motion.span>
            <span className={styles.bookingLabel}>Find a time with Suman</span>
            <ArrowRight className={styles.bookingArrow} aria-hidden="true" size={20} strokeWidth={1.4} />
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
