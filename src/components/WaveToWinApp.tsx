"use client";

import { useCallback, useEffect, useState } from "react";
import { CameraScreen } from "@/components/screens/CameraScreen";
import { QrScreen } from "@/components/screens/QrScreen";
import { StartScreen } from "@/components/screens/StartScreen";
import { TvStage } from "@/components/TvStage";
import type { AppScreen, WaveDetectionResult } from "@/lib/types";

export function WaveToWinApp() {
  const [screen, setScreen] = useState<AppScreen>("start");

  const goStart = useCallback(() => setScreen("start"), []);
  const goCamera = useCallback(() => setScreen("camera"), []);
  const goQr = useCallback((_result: WaveDetectionResult) => {
    setScreen("qr");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Dev helpers for TV testing without a wave.
      if (event.key === "1") setScreen("start");
      if (event.key === "2") setScreen("camera");
      if (event.key === "3") setScreen("qr");
      if (event.key.toLowerCase() === "w" && screen === "camera") {
        setScreen("qr");
      }
      if (event.key === "Escape") setScreen("start");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen]);

  return (
    <TvStage>
      {screen === "start" && <StartScreen onStart={goCamera} />}
      {screen === "camera" && <CameraScreen onWaveDetected={goQr} />}
      {screen === "qr" && <QrScreen onBackHome={goStart} />}
    </TvStage>
  );
}
