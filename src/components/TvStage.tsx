"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "@/lib/constants";
import styles from "./TvStage.module.css";

type TvStageProps = {
  children: ReactNode;
};

/**
 * Renders the Figma 2160×3840 canvas and scales it to fill the TV viewport
 * (1080×1920 or 2160×3840 portrait).
 *
 * Layout uses a sized shell so `transform: scale()` doesn't leave the
 * unscaled 2160×3840 box pushing content into the bottom-right.
 */
export function TvStage({ children }: TvStageProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const next = Math.min(
        window.innerWidth / DESIGN_WIDTH,
        window.innerHeight / DESIGN_HEIGHT,
      );
      setScale(next);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className={styles.viewport}>
      <div
        className={styles.shell}
        style={{
          width: DESIGN_WIDTH * scale,
          height: DESIGN_HEIGHT * scale,
        }}
      >
        <div
          className={styles.stage}
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
