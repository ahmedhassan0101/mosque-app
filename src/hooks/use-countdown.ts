// // src/hooks/use-countdown.ts
import { useState, useEffect, useCallback } from "react";

// export function useCountdown(initialSeconds: number, onComplete?: () => void) {
//   const [seconds, setSeconds] = useState(initialSeconds);
//   const [isActive, setIsActive] = useState(false);

//   const start = useCallback((time?: number) => {
//     if (time !== undefined) setSeconds(time);
//     setIsActive(true);
//   }, []);

//   const reset = useCallback((time: number) => {
//     setSeconds(time);
//     setIsActive(false);
//   }, []);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isActive && seconds > 0) {
//       timer = setInterval(() => {
//         setSeconds((prev) => prev - 1);
//       }, 1000);
//     } else if (seconds === 0 && isActive) {
//       setIsActive(false);
//       if (onComplete) onComplete();
//     }
//     return () => clearInterval(timer);
//   }, [isActive, seconds, onComplete]);

//   return { seconds, start, reset, isActive };
// }

export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback((time?: number) => {
    if (time !== undefined) setSeconds(time);
    setIsActive(true);
  }, []);

  const reset = useCallback((time: number) => {
    setSeconds(time);
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onComplete]);

  return { seconds, start, reset, isActive };
}
