import type { ReactNode } from "react";
import styles from "./PillLabel.module.css";

type PillLabelProps = {
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
};

export function PillLabel({
  children,
  variant = "outline",
  className,
}: PillLabelProps) {
  return (
    <div
      className={[styles.pill, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.text}>{children}</span>
    </div>
  );
}
