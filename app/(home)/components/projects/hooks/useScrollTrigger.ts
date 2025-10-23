import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollTrigger = (ref: React.RefObject<HTMLElement|null>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50, borderColor: 'rgba(255,255,255,0.1)' },
      {
        opacity: 1,
        y: 0,
        borderColor: '#22d3ee',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [ref]);
};

export default useScrollTrigger;
