"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}

/**
 * ModalPortal - Renders children directly to document.body using React Portal
 *
 * Why this is necessary:
 * - Even with position: fixed, parent containers with overflow: hidden,
 *   flex, or grid layouts can constrain child positioning
 * - Portal bypasses all parent layout context
 * - Modal truly positions relative to viewport
 *
 * Benefits:
 * - Modal always centers regardless of parent layout
 * - Works with any page structure
 * - No layout conflicts
 * - Production-grade pattern
 */
export const ModalPortal = ({ children }: ModalPortalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only mount on client side to avoid hydration mismatch
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Don't render on server, only on client
  if (!isMounted) {
    return null;
  }

  return createPortal(children, document.body);
};
