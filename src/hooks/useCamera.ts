"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseCameraOptions = {
  enabled: boolean;
  facingMode?: ConstrainDOMString;
};

export function useCamera({ enabled, facingMode = "user" }: UseCameraOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setReady(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      stop();
      setError(null);
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        setReady(true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to access camera";
        setError(message);
        setReady(false);
      }
    }

    void start();

    return () => {
      cancelled = true;
      stop();
    };
  }, [enabled, facingMode, stop]);

  return { videoRef, ready, error, stop };
}
