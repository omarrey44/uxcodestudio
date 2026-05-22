"use client";

import { useState, useEffect, useRef } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function useTextScramble(text: string, duration = 1200) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Only run the scramble animation on initial mount.
    // Language changes just update the text instantly to avoid layout shift.
    if (mountedRef.current) {
      setDisplayText(text);
      return;
    }
    mountedRef.current = true;

    const startTime = performance.now();
    const totalChars = text.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * totalChars);

      let result = "";
      for (let i = 0; i < totalChars; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration]);

  return displayText;
}
