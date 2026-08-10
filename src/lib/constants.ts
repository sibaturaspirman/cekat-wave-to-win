/** Design canvas from Figma (4K portrait). Scales cleanly to 1080×1920. */
export const DESIGN_WIDTH = 2160;
export const DESIGN_HEIGHT = 3840;

export const QR_COUNTDOWN_SECONDS = 30;

export const QR_TARGET_URL =
  process.env.NEXT_PUBLIC_QR_URL ?? "https://cekat-scratch-logo.vercel.app/";

/** How many left↔right oscillations count as a wave. */
export const WAVE_DIRECTION_CHANGES_REQUIRED = 2;

/** Hold on camera screen after 100% before opening QR. */
export const WAVE_READY_HOLD_MS = 2400;

/** Minimum normalized wrist travel (0–1) per swing. */
export const WAVE_MIN_SWING = 0.035;

/** Ignore tiny jitter on wrist X. */
export const WAVE_NOISE_THRESHOLD = 0.01;
