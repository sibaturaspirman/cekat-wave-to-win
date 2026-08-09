import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const wasmSrc = join(root, "node_modules/@mediapipe/tasks-vision/wasm");
const wasmDest = join(root, "public/mediapipe/wasm");
const modelDest = join(root, "public/mediapipe/models/hand_landmarker.task");
const modelUrl =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

mkdirSync(wasmDest, { recursive: true });
mkdirSync(join(root, "public/mediapipe/models"), { recursive: true });

for (const file of readdirSync(wasmSrc)) {
  copyFileSync(join(wasmSrc, file), join(wasmDest, file));
  console.log("copied", file);
}

const res = await fetch(modelUrl);
if (!res.ok) {
  throw new Error(`Failed to download model: ${res.status}`);
}
const buf = Buffer.from(await res.arrayBuffer());
await import("node:fs/promises").then((fs) => fs.writeFile(modelDest, buf));
console.log("downloaded hand_landmarker.task", buf.length, "bytes");
