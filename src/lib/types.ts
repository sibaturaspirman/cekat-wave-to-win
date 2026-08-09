export type AppScreen = "start" | "camera" | "qr";

export type WaveSide = "left" | "right" | "unknown";

export type WaveDetectionResult = {
  detected: boolean;
  side: WaveSide;
  confidence: number;
};

/** Normalized 0–1 coords in the mirrored camera preview. */
export type WaveTrackingState = {
  handVisible: boolean;
  handX: number;
  handY: number;
  /** 0–1 wave completion. */
  progress: number;
  swings: number;
  requiredSwings: number;
};
