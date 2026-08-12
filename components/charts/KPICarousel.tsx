"use client";

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /**
   * Largeur de base de chaque item (défaut 240px).
   * Les items s'etirent pour remplir la ligne quand ils tiennent tous a
   * l'ecran, et conservent cette largeur des qu'il y a de quoi defiler.
   */
  itemWidth?: number;
  /** Vitesse du defilement automatique, en pixels par seconde. */
  speed?: number;
};

export default function KPICarousel({
  children,
  itemWidth = 240,
  speed = 35,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  /** Le contenu deborde : on duplique les cards pour boucler sans a-coup. */
  const [looping, setLooping] = useState(false);

  const items = Children.toArray(children);
  const count = items.length;
  const rendered = looping ? [...items, ...items] : items;

  /** Mise en pause temporaire (survol, focus, glissement, clic sur fleche). */
  const pausedRef = useRef(false);
  const resumeAtRef = useRef(0);

  const pauseFor = (ms: number) => {
    resumeAtRef.current = Math.max(
      resumeAtRef.current,
      performance.now() + ms,
    );
  };

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  // Le contenu deborde-t-il ? Determine si l'on boucle ou non.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const el = scrollRef.current;
      if (!el) return;
      if (looping) {
        // En boucle, une seule copie suffit-elle encore a deborder ?
        const period = periodWidth(el, count);
        if (period > 0 && period <= el.clientWidth + 1) setLooping(false);
      } else if (el.scrollWidth > el.clientWidth + 1) {
        setLooping(true);
      }
      updateEdges();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [looping, count, updateEdges]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    return () => el.removeEventListener("scroll", updateEdges);
  }, [updateEdges]);

  // Defilement automatique
  useEffect(() => {
    if (!looping) return;
    const el = scrollRef.current;
    if (!el) return;

    // Respecte le reglage systeme "reduire les animations"
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      const dt = Math.min(now - last, 100) / 1000; // borne les onglets en veille
      last = now;

      if (pausedRef.current || now < resumeAtRef.current) return;

      const period = periodWidth(el, count);
      if (period <= 0) return;

      let next = el.scrollLeft + speed * dt;
      // Raccord invisible : la seconde copie est identique a la premiere
      if (next >= period) next -= period;
      el.scrollLeft = next;
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [looping, count, speed]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    pauseFor(2500); // laisse le temps de lire apres un clic
    const distance = Math.max(el.clientWidth * 0.7, itemWidth);
    const period = looping ? periodWidth(el, count) : 0;
    let target = el.scrollLeft + (direction === "left" ? -distance : distance);

    // En boucle, on se replace dans la copie voisine plutot que de buter
    if (period > 0) {
      if (target < 0) {
        el.scrollLeft += period;
        target += period;
      } else if (target > period * 2 - el.clientWidth) {
        el.scrollLeft -= period;
        target -= period;
      }
    }
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  /** Defilement a la souris : on saisit la bande et on la fait glisser. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    // Souris uniquement : le tactile a deja son defilement natif
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;

    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      if (!moved && Math.abs(delta) > 4) {
        moved = true;
        setIsDragging(true);
      }
      if (!moved) return;

      const period = looping ? periodWidth(el, count) : 0;
      let next = startScroll - delta;
      if (period > 0) next = ((next % period) + period) % period;
      el.scrollLeft = next;
      ev.preventDefault();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setIsDragging(false);
      pauseFor(2500);
      // Empeche le clic de fin de glissement d'ouvrir une fiche indicateur
      if (moved) {
        el.addEventListener("click", (ev) => ev.stopPropagation(), {
          capture: true,
          once: true,
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const showArrows = looping || canLeft || canRight;

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
    >
      <Button
        type="button"
        variant="orange"
        size="icon"
        onClick={() => scroll("left")}
        aria-label="Faire défiler à gauche"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-9 w-9 rounded-full shadow-md transition-opacity cursor-pointer ${
          showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Bande scrollable */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        style={{
          // Le defilement continu pilote scrollLeft image par image : un
          // scroll-behavior lisse en CSS s'appliquerait a chaque ecriture et
          // ferait begayer l'animation. Les clics sur les fleches demandent
          // leur lissage explicitement via scrollTo.
          scrollBehavior: "auto",
          scrollSnapType: looping || isDragging ? "none" : "x mandatory",
        }}
        className={`flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? "cursor-grabbing select-none" : showArrows ? "cursor-grab" : ""
        }`}
      >
        {rendered.map((child, i) => (
          <div
            key={i}
            className="snap-start"
            // En boucle, largeur figee : le raccord doit etre exact
            style={{ flex: looping ? `0 0 ${itemWidth}px` : `1 0 ${itemWidth}px` }}
            aria-hidden={looping && i >= count ? true : undefined}
          >
            {child}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="orange"
        size="icon"
        onClick={() => scroll("right")}
        aria-label="Faire défiler à droite"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-9 w-9 rounded-full shadow-md transition-opacity cursor-pointer ${
          showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Distance entre une card et son double dans la copie suivante :
 * c'est la periode exacte du raccord, gaps compris.
 */
function periodWidth(el: HTMLElement, count: number) {
  const first = el.children[0] as HTMLElement | undefined;
  const clone = el.children[count] as HTMLElement | undefined;
  if (!first || !clone) return 0;
  return clone.offsetLeft - first.offsetLeft;
}
