import { useCallback, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";

type UseCarouselInteractionOptions = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  pauseMs?: number;
  swipeThreshold?: number;
};

type PointerState = {
  id: number;
  startX: number;
};

export function useCarouselInteraction({
  onSwipeLeft,
  onSwipeRight,
  pauseMs = 2000,
  swipeThreshold = 48,
}: UseCarouselInteractionOptions) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerRef = useRef<PointerState | null>(null);
  const pauseUntilRef = useRef(0);
  const ignoreClickRef = useRef(false);
  const ignoreClickTimerRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragStartThreshold = 8;

  const pauseAuto = useCallback(() => {
    pauseUntilRef.current = Date.now() + pauseMs;
  }, [pauseMs]);

  const resetDrag = useCallback(() => {
    pointerRef.current = null;
    draggingRef.current = false;
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const finishDrag = useCallback(
    (clientX: number) => {
      const pointer = pointerRef.current;

      if (!pointer) return;

      const delta = clientX - pointer.startX;
      const hasSwiped = Math.abs(delta) >= swipeThreshold;

      if (hasSwiped) {
        if (ignoreClickTimerRef.current !== null) {
          window.clearTimeout(ignoreClickTimerRef.current);
        }
        ignoreClickRef.current = true;
        ignoreClickTimerRef.current = window.setTimeout(() => {
          ignoreClickRef.current = false;
          ignoreClickTimerRef.current = null;
        }, 350);
        if (delta < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }

      pauseAuto();
      resetDrag();
    },
    [onSwipeLeft, onSwipeRight, pauseAuto, resetDrag, swipeThreshold]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary) return;

      pauseAuto();
      draggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      pointerRef.current = {
        id: event.pointerId,
        startX: event.clientX,
      };
    },
    [pauseAuto]
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) return;

    const delta = event.clientX - pointer.startX;
    if (!draggingRef.current) {
      if (Math.abs(delta) < dragStartThreshold) return;
      draggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setDragOffset(delta);
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const pointer = pointerRef.current;

      if (!pointer || pointer.id !== event.pointerId) return;

      finishDrag(event.clientX);
    },
    [finishDrag]
  );

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const pointer = pointerRef.current;

      if (!pointer || pointer.id !== event.pointerId) return;

      pauseAuto();
      resetDrag();
    },
    [pauseAuto, resetDrag]
  );

  const onLostPointerCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const pointer = pointerRef.current;

      if (!pointer || pointer.id !== event.pointerId) return;

      resetDrag();
    },
    [resetDrag]
  );

  const onClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!ignoreClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    ignoreClickRef.current = false;

    if (ignoreClickTimerRef.current !== null) {
      window.clearTimeout(ignoreClickTimerRef.current);
      ignoreClickTimerRef.current = null;
    }
  }, []);

  return {
    dragOffset,
    isDragging,
    pauseAuto,
    pauseUntilRef,
    bindDragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      onClickCapture,
    },
  } as const;
}
