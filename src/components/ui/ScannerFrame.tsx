import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./ScannerFrame.module.css";

type ScannerFrameProps = {
  children?: ReactNode;
  className?: string;
};

export function ScannerFrame({ children, className }: ScannerFrameProps) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")}>
      <div className={styles.content}>{children}</div>
      <Image
        src="/assets/scanner-frame.svg"
        alt=""
        width={1374}
        height={1423}
        className={styles.corners}
        unoptimized
        aria-hidden
      />
    </div>
  );
}
