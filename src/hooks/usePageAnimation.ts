import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

export function usePageAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.page-header', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' });
    gsap.from('.page-content', { y: 20, opacity: 0, duration: 0.5, delay: 0.15, ease: 'power2.out', clearProps: 'all' });
  }, { scope: containerRef });

  return containerRef;
}
