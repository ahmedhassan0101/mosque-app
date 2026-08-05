// src/hooks/use-countdown.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/*
  Fix: المشكلة كانت إن onComplete() بيتنفذ جوه setSeconds() functional updater
  اللي بيحصل أثناء الـ render — وده بيخلي router.push() تحصل في وسط render cycle.

  الحل: نخلي الـ interval مسؤول عن الـ countdown بس،
  وuseEffect منفصل يراقب seconds === 0 ويستدعي onComplete بعد الـ render.
*/
export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  // Ref للـ callback — بيتحدث بدون ما يعيد تشغيل الـ effects
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback((time?: number) => {
    if (time !== undefined) setSeconds(time);
    setIsActive(true);
  }, []);

  const reset = useCallback((time: number) => {
    setSeconds(time);
    setIsActive(false);
  }, []);

  // Countdown tick — مسؤول عن الـ decrement والـ stop بس
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // onComplete — useEffect مستقل يشتغل بعد الـ render لما seconds تبقى 0
  useEffect(() => {
    if (seconds === 0 && !isActive) {
      onCompleteRef.current?.();
    }
  }, [seconds, isActive]);

  return { seconds, start, reset, isActive };
}

// // src/hooks/use-countdown.ts
// import { useState, useEffect, useCallback, useRef } from "react";

// /*
//   useCountdown:
//   - start(time?) → يبدأ الـ countdown من time أو من initialSeconds
//   - reset(time)  → يوقف ويرجع لـ time معينة
//   - isActive     → هل الـ countdown شغال حالياً

// */
// export function useCountdown(initialSeconds: number, onComplete?: () => void) {
//   const [seconds, setSeconds] = useState(initialSeconds);
//   const [isActive, setIsActive] = useState(false);

//   const onCompleteRef = useRef(onComplete);
//   useEffect(() => {
//     onCompleteRef.current = onComplete;
//   }, [onComplete]);

//   const start = useCallback((time?: number) => {
//     if (time !== undefined) setSeconds(time);
//     setIsActive(true);
//   }, []);

//   const reset = useCallback((time: number) => {
//     setSeconds(time);
//     setIsActive(false);
//   }, []);

//   useEffect(() => {
//     if (!isActive) return;

//     const timer = setInterval(() => {
//       setSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsActive(false);
//           onCompleteRef.current?.();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isActive]);

//   return { seconds, start, reset, isActive };
// }
