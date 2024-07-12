import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

export async function gesture() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );
  const gestureRecognizer = await GestureRecognizer.createFromModelPath(
    vision,
    "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
  );
  return { gestureRecognizer };
}
