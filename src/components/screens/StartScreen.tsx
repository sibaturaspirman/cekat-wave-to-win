"use client";

import styles from "./StartScreen.module.css";

type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <button
      type="button"
      className={styles.screen}
      onClick={onStart}
      aria-label="Tap to start"
    >
      <div className={styles.headline}>
        <p>Ready for</p>
        <p>the challenge?</p>
      </div>
      <img
        src="/assets/start-blob.svg"
        alt=""
        className={styles.blob}
        draggable={false}
        aria-hidden
      />
      <p className={styles.cta}>Tap to start</p>
    </button>
  );
}
