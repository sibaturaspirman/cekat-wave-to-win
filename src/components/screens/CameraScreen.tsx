"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CekatLogo } from "@/components/ui/CekatLogo";
import { PillLabel } from "@/components/ui/PillLabel";
import { ScannerFrame } from "@/components/ui/ScannerFrame";
import { useCamera } from "@/hooks/useCamera";
import { useWaveDetection } from "@/hooks/useWaveDetection";
import {
  WAVE_DIRECTION_CHANGES_REQUIRED,
  WAVE_READY_HOLD_MS,
} from "@/lib/constants";
import type { WaveDetectionResult, WaveTrackingState } from "@/lib/types";
import styles from "./CameraScreen.module.css";

type CameraScreenProps = {
  onWaveDetected: (result: WaveDetectionResult) => void;
};

const initialTracking: WaveTrackingState = {
  handVisible: false,
  handX: 0.5,
  handY: 0.5,
  progress: 0,
  swings: 0,
  requiredSwings: WAVE_DIRECTION_CHANGES_REQUIRED,
};

export function CameraScreen({ onWaveDetected }: CameraScreenProps) {
  const { videoRef, ready, error } = useCamera({ enabled: true });
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [tracking, setTracking] = useState<WaveTrackingState>(initialTracking);
  const [isReadyHold, setIsReadyHold] = useState(false);
  const [waveError, setWaveError] = useState<string | null>(null);
  const pendingResultRef = useRef<WaveDetectionResult | null>(null);
  const onWaveDetectedRef = useRef(onWaveDetected);
  onWaveDetectedRef.current = onWaveDetected;

  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      setVideoEl(node);
    },
    [videoRef],
  );

  const handleTracking = useCallback((state: WaveTrackingState) => {
    setTracking((prev) => {
      if (prev.progress >= 1) {
        return {
          ...state,
          progress: 1,
          swings: Math.max(state.swings, prev.requiredSwings),
        };
      }
      return state;
    });
  }, []);

  const handleWave = useCallback((result: WaveDetectionResult) => {
    if (pendingResultRef.current) return;
    pendingResultRef.current = result;
    setIsReadyHold(true);
    setTracking((prev) => ({
      ...prev,
      progress: 1,
      swings: prev.requiredSwings,
    }));
  }, []);

  const handleWaveError = useCallback((message: string) => {
    setWaveError(message);
  }, []);

  useEffect(() => {
    if (!isReadyHold || !pendingResultRef.current) return;

    const result = pendingResultRef.current;
    const id = window.setTimeout(() => {
      onWaveDetectedRef.current(result);
    }, WAVE_READY_HOLD_MS);

    return () => window.clearTimeout(id);
  }, [isReadyHold]);

  useWaveDetection({
    enabled: ready && !error && !isReadyHold,
    video: videoEl,
    onWave: handleWave,
    onTracking: handleTracking,
    onError: handleWaveError,
  });

  const progressPercent = Math.round(tracking.progress * 100);

  return (
    <div className={styles.screen}>
      <div className={styles.bg} aria-hidden />
      <CekatLogo />
      <PillLabel className={styles.label}>{`Wave To Win  👋🏻`}</PillLabel>

      <div className={styles.scannerWrap}>
        <ScannerFrame>
          <video
            ref={setVideoRef}
            className={styles.video}
            playsInline
            muted
            autoPlay
          />

          {tracking.handVisible && !isReadyHold && (
            <div
              className={styles.handIcon}
              style={{
                left: `${tracking.handX * 100}%`,
                top: `${tracking.handY * 100}%`,
              }}
            >
              {/* Plain img so SW can serve /assets/* offline (no /_next/image). */}
              <img
                src="/assets/logo-cekat-2.png"
                alt=""
                width={180}
                height={146}
                className={styles.handIconImage}
                draggable={false}
                aria-hidden
              />
            </div>
          )}

          {isReadyHold && (
            <div className={styles.readyOverlay} aria-live="assertive">
              <p className={styles.readyText}>Are you ready?...</p>
              <div className={styles.readyDots} aria-hidden>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {!ready && !error && !isReadyHold && (
            <p className={styles.placeholder}>Waiting for Camera</p>
          )}
          {error && (
            <p className={styles.error}>
              Camera unavailable
              <span className={styles.errorHint}>{error}</span>
            </p>
          )}
          {!error && waveError && (
            <p className={styles.error}>
              Wave detection unavailable
              <span className={styles.errorHint}>{waveError}</span>
            </p>
          )}
        </ScannerFrame>
      </div>

      <div className={styles.progressBlock} aria-live="polite">
        <div className={styles.progressMeta}>
          <span className={styles.progressLabel}>
            {isReadyHold
              ? "Almost there…"
              : tracking.handVisible
                ? "Keep waving!"
                : "Show your hand"}
          </span>
          <span className={styles.progressValue}>{progressPercent}%</span>
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className={styles.progressDots}>
          {Array.from({ length: tracking.requiredSwings }, (_, i) => (
            <span
              key={i}
              className={[
                styles.dot,
                i < tracking.swings || isReadyHold ? styles.dotFilled : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>

      <p className={styles.hint}>
        {isReadyHold ? "Loading your QR…" : "Wave your hand left or right"}
      </p>
    </div>
  );
}
