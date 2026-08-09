"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CekatLogo } from "@/components/ui/CekatLogo";
import { PillLabel } from "@/components/ui/PillLabel";
import { ScannerFrame } from "@/components/ui/ScannerFrame";
import { useCountdown } from "@/hooks/useCountdown";
import { QR_COUNTDOWN_SECONDS, QR_TARGET_URL } from "@/lib/constants";
import { createQrDataUrl } from "@/lib/qr";
import styles from "./QrScreen.module.css";

type QrScreenProps = {
  onBackHome: () => void;
};

export function QrScreen({ onBackHome }: QrScreenProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const handleComplete = useCallback(() => {
    onBackHome();
  }, [onBackHome]);

  const remaining = useCountdown(
    QR_COUNTDOWN_SECONDS,
    true,
    handleComplete,
  );

  useEffect(() => {
    let cancelled = false;
    void createQrDataUrl(QR_TARGET_URL).then((url) => {
      if (!cancelled) setQrUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <button
      type="button"
      className={styles.screen}
      onClick={onBackHome}
      aria-label="Tap anywhere to return home"
    >
      <div className={styles.bg} aria-hidden />
      <CekatLogo />
      <PillLabel className={styles.label}>Scan the QR code to play</PillLabel>

      <div className={styles.scannerWrap}>
        <ScannerFrame>
          {qrUrl ? (
            <Image
              src={qrUrl}
              alt="QR code"
              width={1124}
              height={1124}
              className={styles.qr}
              unoptimized
            />
          ) : (
            <p className={styles.loading}>Loading QR…</p>
          )}
        </ScannerFrame>
      </div>

      <PillLabel variant="solid" className={styles.countdown}>
        {remaining}s
      </PillLabel>

      <p className={styles.tapHint}>Tap anywhere to go back</p>
    </button>
  );
}
