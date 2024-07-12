import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef<Webcam>(null);
  const [gestureRecognizer, setGestureRecognizer] =
    useState<GestureRecognizer>();
  const [numberRecognized, setNumberRecognized] = useState<number>();

  const capture = async () => {
    if (webcamRef.current && gestureRecognizer) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          const detections = gestureRecognizer.recognize(img);
          if (detections.gestures.length > 0) {
            setNumberRecognized(Number(detections.gestures[0][0].categoryName));
          } else {
            setNumberRecognized(undefined);
          }
          console.log(detections);
        };
      }
    }
  };

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const gestureRecognizer = await GestureRecognizer.createFromModelPath(
        vision,
        "/models/gesture_recognizer.task"
      );
      setGestureRecognizer(gestureRecognizer);
    }
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1000);

    return () => clearInterval(interval);
  }, [gestureRecognizer]);

  if (!gestureRecognizer) return <div>loading...</div>;

  return (
    <div className="container">
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          className="webcam"
        />
        {numberRecognized !== undefined && (
          <p className="number-recognized">{numberRecognized}</p>
        )}
      </div>
      <button onClick={capture}>Capture</button>
    </div>
  );
}

export default App;
