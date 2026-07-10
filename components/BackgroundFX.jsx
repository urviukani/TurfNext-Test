"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed decorative background: blurred color blobs, a faint dotted grid,
 * and a vignette. Purely visual — aria-hidden and pointer-events-none.
 * A subtle scroll-linked parallax is applied directly via refs (not React
 * state) so scrolling stays perfectly smooth with zero extra re-renders.
 */
export default function BackgroundFX() {
  const parallaxRef = useRef(null);
  const gridRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${y * 0.12}px)`;
        }
        if (gridRef.current) {
          gridRef.current.style.transform = `translateY(${y * 0.05}px)`;
        }
        tickingRef.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        ref={parallaxRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none will-change-transform"
      >
        <div className="absolute rounded-full blur-[90px] w-[560px] h-[560px] bg-accent opacity-[0.14] -top-[180px] -left-[120px] animate-floatA" />
        <div className="absolute rounded-full blur-[90px] w-[460px] h-[460px] bg-bd opacity-[0.13] top-[10%] -right-[140px] animate-floatB" />
        <div className="absolute rounded-full blur-[90px] w-[520px] h-[520px] bg-accent opacity-[0.09] -bottom-[220px] left-[20%] animate-floatC" />
        <div className="absolute rounded-full blur-[90px] w-[340px] h-[340px] bg-fb opacity-[0.10] bottom-[15%] right-[8%] animate-floatBRev" />
      </div>

      <div
        ref={gridRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none opacity-30 will-change-transform bg-[length:46px_46px] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_900px_700px_at_50%_20%,#000_10%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_900px_700px_at_50%_20%,#000_10%,transparent_78%)]"
      />

      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none [background:radial-gradient(ellipse_100%_100%_at_50%_0%,transparent_55%,#0D0D0D_100%)]"
      />
    </>
  );
}
