"use client";

import { useEffect, useRef } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import {
  WAVE_DIRECTION_CHANGES_REQUIRED,
  WAVE_MIN_SWING,
  WAVE_NOISE_THRESHOLD,
} from "@/lib/constants";
import {
  HAND_LANDMARKER_MODEL_PATH,
  MEDIAPIPE_WASM_PATH,
} from "@/lib/mediapipe";
import type {
  WaveDetectionResult,
  WaveSide,
  WaveTrackingState,
} from "@/lib/types";

type UseWaveDetectionOptions = {
  enabled: boolean;
  video: HTMLVideoElement | null;
  onWave: (result: WaveDetectionResult) => void;
  onTracking?: (state: WaveTrackingState) => void;
  onError?: (message: string) => void;
};

type Direction = -1 | 0 | 1;

const idleTracking: WaveTrackingState = {
  handVisible: false,
  handX: 0.5,
  handY: 0.5,
  progress: 0,
  swings: 0,
  requiredSwings: WAVE_DIRECTION_CHANGES_REQUIRED,
};

async function createHandLandmarker(vision: Awaited<
  ReturnType<typeof FilesetResolver.forVisionTasks>
>) {
  const shared = {
    baseOptions: {
      modelAssetPath: HAND_LANDMARKER_MODEL_PATH,
      delegate: "GPU" as const,
    },
    runningMode: "VIDEO" as const,
    numHands: 1,
  };

  try {
    return await HandLandmarker.createFromOptions(vision, shared);
  } catch (gpuError) {
    console.warn("MediaPipe GPU failed, falling back to CPU", gpuError);
    return HandLandmarker.createFromOptions(vision, {
      ...shared,
      baseOptions: {
        ...shared.baseOptions,
        delegate: "CPU",
      },
    });
  }
}

/**
 * Detects a left/right hand wave from wrist X oscillation.
 * Uses locally hosted MediaPipe assets so it works fully offline.
 */
export function useWaveDetection({
  enabled,
  video,
  onWave,
  onTracking,
  onError,
}: UseWaveDetectionOptions) {
  const onWaveRef = useRef(onWave);
  onWaveRef.current = onWave;
  const onTrackingRef = useRef(onTracking);
  onTrackingRef.current = onTracking;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const triggeredRef = useRef(false);
  const xsRef = useRef<number[]>([]);
  const directionRef = useRef<Direction>(0);
  const changesRef = useRef(0);
  const swingMinRef = useRef<number | null>(null);
  const swingMaxRef = useRef<number | null>(null);
  const lastHandednessRef = useRef<WaveSide>("unknown");

  useEffect(() => {
    if (!enabled || !video) {
      onTrackingRef.current?.(idleTracking);
      return;
    }

    let cancelled = false;
    let landmarker: HandLandmarker | null = null;
    let raf = 0;
    let lastVideoTime = -1;
    let missedFrames = 0;
    const MAX_MISSED_FRAMES = 12;

    triggeredRef.current = false;
    xsRef.current = [];
    directionRef.current = 0;
    changesRef.current = 0;
    swingMinRef.current = null;
    swingMaxRef.current = null;

    function emitTracking(partial: Partial<WaveTrackingState>) {
      const swings = changesRef.current;
      onTrackingRef.current?.({
        handVisible: false,
        handX: 0.5,
        handY: 0.5,
        progress: Math.min(1, swings / WAVE_DIRECTION_CHANGES_REQUIRED),
        swings,
        requiredSwings: WAVE_DIRECTION_CHANGES_REQUIRED,
        ...partial,
      });
    }

    /** Clear short-term motion sample only — keep wave progress. */
    function pauseSwingSampling() {
      directionRef.current = 0;
      swingMinRef.current = null;
      swingMaxRef.current = null;
      xsRef.current = [];
      emitTracking({ handVisible: false });
    }

    function handleMissingHand() {
      missedFrames += 1;
      if (missedFrames >= MAX_MISSED_FRAMES) {
        pauseSwingSampling();
      } else {
        emitTracking({ handVisible: false });
      }
    }

    function observeWrist(x: number, side: WaveSide) {
      lastHandednessRef.current = side;
      const xs = xsRef.current;
      xs.push(x);
      if (xs.length > 24) xs.shift();

      const prev = xs[xs.length - 2];
      if (prev == null) return;

      const delta = x - prev;
      if (Math.abs(delta) < WAVE_NOISE_THRESHOLD) return;

      const nextDir: Direction = delta > 0 ? 1 : -1;
      const prevDir = directionRef.current;

      if (swingMinRef.current == null || x < swingMinRef.current) {
        swingMinRef.current = x;
      }
      if (swingMaxRef.current == null || x > swingMaxRef.current) {
        swingMaxRef.current = x;
      }

      if (prevDir !== 0 && nextDir !== prevDir) {
        const span =
          (swingMaxRef.current ?? x) - (swingMinRef.current ?? x);
        if (span >= WAVE_MIN_SWING) {
          changesRef.current += 1;
          swingMinRef.current = x;
          swingMaxRef.current = x;
        }
      }

      directionRef.current = nextDir;

      if (
        !triggeredRef.current &&
        changesRef.current >= WAVE_DIRECTION_CHANGES_REQUIRED
      ) {
        triggeredRef.current = true;
        onWaveRef.current({
          detected: true,
          side: lastHandednessRef.current,
          confidence: Math.min(1, changesRef.current / 4),
        });
      }
    }

    function processResult(result: HandLandmarkerResult) {
      const landmarks = result.landmarks[0];
      if (!landmarks) {
        handleMissingHand();
        return;
      }

      const wrist = landmarks[0];
      const middleMcp = landmarks[9];
      if (!wrist || !middleMcp) {
        handleMissingHand();
        return;
      }

      missedFrames = 0;

      const palmX = (wrist.x + middleMcp.x) / 2;
      const palmY = (wrist.y + middleMcp.y) / 2;

      const label = result.handedness[0]?.[0]?.categoryName?.toLowerCase();
      const side: WaveSide =
        label === "left" ? "right" : label === "right" ? "left" : "unknown";

      observeWrist(wrist.x, side);

      emitTracking({
        handVisible: true,
        handX: 1 - palmX,
        handY: palmY,
      });
    }

    async function setup() {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_PATH);
      if (cancelled) return;

      landmarker = await createHandLandmarker(vision);
      if (cancelled) {
        landmarker.close();
        landmarker = null;
        return;
      }

      const tick = () => {
        if (cancelled || !landmarker || !video) return;

        if (
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          video.currentTime !== lastVideoTime
        ) {
          lastVideoTime = video.currentTime;
          try {
            const result = landmarker.detectForVideo(
              video,
              performance.now(),
            );
            processResult(result);
          } catch (err) {
            console.error("detectForVideo failed", err);
          }
        }

        raf = window.requestAnimationFrame(tick);
      };

      raf = window.requestAnimationFrame(tick);
    }

    void setup().catch((err) => {
      console.error("Wave detection failed to start", err);
      const message =
        err instanceof Error
          ? err.message
          : "Wave detection failed to load offline assets";
      onErrorRef.current?.(message);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      landmarker?.close();
      onTrackingRef.current?.(idleTracking);
    };
  }, [enabled, video]);
}
