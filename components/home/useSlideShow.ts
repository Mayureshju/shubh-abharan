"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { useReducedMotion } from "motion/react";

const AUTOPLAY_MS = 6000;

/**
 * Shared slideshow state for the hero, the collection split, and the
 * product row slider. Autoplay is opt-in; reduced motion, hidden documents,
 * offscreen roots and any pointer/keyboard interaction all pause it.
 */

export function useSlideShow(count: number, autoplay: boolean) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = count === 0 ? 0 : index % count;

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay || reduce || paused || hidden || !visible || count < 2) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, reduce, paused, hidden, visible, count, go]);

  const pauseProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setPaused(false);
      }
    },
    onPointerDown: () => setPaused(true),
  };

  return { index: current, setIndex, go, rootRef, pauseProps, reduce, count };
}
