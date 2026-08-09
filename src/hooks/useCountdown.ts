"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdown(
  seconds: number,
  active: boolean,
  onComplete: () => void,
) {
  const [remaining, setRemaining] = useState(seconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setRemaining(seconds);
      return;
    }

    setRemaining(seconds);
    const startedAt = Date.now();

    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const next = Math.max(seconds - elapsed, 0);
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(id);
        onCompleteRef.current();
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [active, seconds]);

  return remaining;
}
