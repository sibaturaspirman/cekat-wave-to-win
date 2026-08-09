/** Same-origin MediaPipe assets for full offline support. */
export const MEDIAPIPE_WASM_PATH = "/mediapipe/wasm";
export const HAND_LANDMARKER_MODEL_PATH =
  "/mediapipe/models/hand_landmarker.task";

export const MEDIAPIPE_PRECACHE_URLS = [
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_internal.js`,
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_internal.wasm`,
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_module_internal.js`,
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_module_internal.wasm`,
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_nosimd_internal.js`,
  `${MEDIAPIPE_WASM_PATH}/vision_wasm_nosimd_internal.wasm`,
  HAND_LANDMARKER_MODEL_PATH,
] as const;
