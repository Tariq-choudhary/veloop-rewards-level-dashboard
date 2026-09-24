import { useEffect, useState } from "react";
import {
  earningFeatures,
  levelRoadmap,
  userLevelData,
  xpActivity,
} from "../data/levelData.js";

/**
 * Simulates fetching the dashboard's data from a backend.
 * Real integration point: swap the setTimeout below for an actual
 * API call and keep the same { status, data } shape.
 *
 * For reviewing the error state without a real backend failure,
 * open the app with ?forceError=1 in the URL.
 */
export function useLevelData() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [data, setData] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus("loading");
    const forceError =
      typeof window !== "undefined" &&
      window.location.search.includes("forceError");

    const t = setTimeout(() => {
      if (forceError) {
        setStatus("error");
        return;
      }
      setData({
        ...userLevelData,
        roadmap: levelRoadmap,
        earningFeatures,
        xpActivity,
      });
      setStatus("ready");
    }, 650);

    return () => clearTimeout(t);
  }, [attempt]);

  const retry = () => setAttempt((a) => a + 1);

  return { status, data, retry };
}
