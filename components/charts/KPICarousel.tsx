"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /** Largeur fixe de chaque item (défaut 240px) */
  itemWidth?: number;
};

export default function KPICarousel({ children, itemWidth = 240 }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Bouton gauche */}
      <Button
        type="button"
        variant="orange"
        size="icon"
        onClick={() => scroll("left")}
        disabled={!canLeft}
        aria-label="Faire défiler à gauche"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-9 w-9 rounded-full shadow-md transition-opacity cursor-pointer ${
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Conteneur scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                className="snap-start shrink-0"
                style={{ width: itemWidth }}
              >
                {child}
              </div>
            ))
          : (
            <div className="snap-start shrink-0" style={{ width: itemWidth }}>
              {children}
            </div>
          )}
      </div>

      {/* Bouton droite */}
      <Button
        type="button"
        variant="orange"
        size="icon"
        onClick={() => scroll("right")}
        disabled={!canRight}
        aria-label="Faire défiler à droite"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-9 w-9 rounded-full shadow-md transition-opacity cursor-pointer ${
          canRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
