import { useRef } from 'react';
import { gsap } from 'gsap';

export default function SDGBadge() {
  const ref = useRef<HTMLAnchorElement>(null);

  const onEnter = () => gsap.to(ref.current, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
  const onLeave = () => gsap.to(ref.current, { scale: 1, duration: 0.2, ease: 'power2.in' });

  return (
    <a
      ref={ref}
      href="https://www.un.org/sustainabledevelopment/es/globalpartnerships/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#19486A] border border-white/20 cursor-pointer"
      aria-label="ODS 17 Meta 17.3 - Alianzas para el Desarrollo Sostenible"
    >
      🌐 ODS 17 · Meta 17.3
    </a>
  );
}
