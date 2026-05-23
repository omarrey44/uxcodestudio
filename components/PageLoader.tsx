"use client";

import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const overlayControls = useAnimationControls();
  const logoControls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyShown = (() => {
      try { return sessionStorage.getItem("loader-shown") === "1"; }
      catch { return false; }
    })();

    if (alreadyShown || prefersReduced) {
      window.dispatchEvent(new Event("loader:done"));
      setVisible(false);
      return;
    }

    async function sequence() {
      await logoControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      });
      if (cancelled) return;
      await new Promise<void>((r) => { timer = setTimeout(r, 300); });
      if (cancelled) return;
      try { sessionStorage.setItem("loader-shown", "1"); } catch { /* storage blocked */ }
      await overlayControls.start({
        y: "-100%",
        transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
      });
      if (cancelled) return;
      window.dispatchEvent(new Event("loader:done"));
      setVisible(false);
    }

    sequence().catch(() => {
      // animation interrupted (e.g. unmount) — dispatch done so Hero never hangs
      if (!cancelled) {
        window.dispatchEvent(new Event("loader:done"));
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [logoControls, overlayControls]);

  if (!visible) return null;

  return (
    <motion.div
      animate={overlayControls}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    >
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.85 }}
      >
        <Image
          src="/logo.png"
          width={160}
          height={80}
          alt="UXCODESTUDIO"
          priority
          style={{ height: "auto" }}
        />
      </motion.div>
    </motion.div>
  );
}
