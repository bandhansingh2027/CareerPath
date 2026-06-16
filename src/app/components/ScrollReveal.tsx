import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 800,
  style = {}
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getDirectionTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(24px)';
      case 'down': return 'translateY(-24px)';
      case 'left': return 'translateX(24px)';
      case 'right': return 'translateX(-24px)';
      default: return 'none';
    }
  };

  const revealStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : getDirectionTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    ...style
  };

  return (
    <div ref={domRef} style={revealStyle} className={className}>
      {children}
    </div>
  );
}
