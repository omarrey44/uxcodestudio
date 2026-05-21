"use client";

import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const overlayControls = useAnimationControls();
  const logoControls = useAnimationControls();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyShown = sessionStorage.getItem("loader-shown") === "1";

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
      await new Promise<void>((r) => setTimeout(r, 300));
      sessionStorage.setItem("loader-shown", "1");
      await overlayControls.start({
        y: "-100%",
        transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
      });
      window.dispatchEvent(new Event("loader:done"));
      setVisible(false);
    }

    sequence();
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
        />
      </motion.div>
    </motion.div>
  );
}
