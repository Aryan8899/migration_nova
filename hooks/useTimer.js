"use client";
import { useEffect, useRef, useState } from "react";

export function useTimer(expiryTimestamp, onExpire) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date(expiryTimestamp).getTime();
    return Math.max(0, target - Date.now());
  });

  const intervalRef = useRef(null);

  const calculateTimeLeft = () => {
    const now = Date.now();
    const target = new Date(expiryTimestamp).getTime();
    return Math.max(0, target - now);
  };

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const start = () => {
    clear();
    intervalRef.current = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clear();
        if (typeof onExpire === "function") {
          onExpire();
        }
      }
    }, 1000);
  };

  const restart = (newExpiry) => {
    expiryTimestamp = newExpiry;
    setTimeLeft(() => {
      const newTime = new Date(newExpiry).getTime();
      return Math.max(0, newTime - Date.now());
    });
    start();
  };

  useEffect(() => {
    start();
    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryTimestamp]);

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  const isRunning = timeLeft > 0;

  return {
    seconds: isNaN(seconds) ? "00" : String(seconds)?.padStart(2, 0),
    minutes: isNaN(minutes) ? "00" : String(minutes)?.padStart(2, 0),
    hours: isNaN(hours) ? "00" : String(hours)?.padStart(2, 0),
    isRunning,
    restart,
  };
}
