import { Compass, Rocket, Target, Award, Briefcase, GraduationCap, TrendingUp, Brain } from 'lucide-react';

export function BackgroundPatterns() {
  const signs = [
    { Icon: Compass, style: { top: '15%', left: '8%', animationDelay: '0s' }, size: 48 },
    { Icon: Rocket, style: { top: '42%', right: '7%', animationDelay: '-2s' }, size: 56 },
    { Icon: Target, style: { top: '78%', left: '10%', animationDelay: '-4s' }, size: 52 },
    { Icon: Award, style: { top: '22%', right: '9%', animationDelay: '-6s' }, size: 44 },
    { Icon: Briefcase, style: { top: '68%', right: '11%', animationDelay: '-8s' }, size: 48 },
    { Icon: GraduationCap, style: { top: '85%', right: '8%', animationDelay: '-1s' }, size: 52 },
    { Icon: TrendingUp, style: { top: '56%', left: '6%', animationDelay: '-3s' }, size: 46 },
    { Icon: Brain, style: { top: '34%', left: '14%', animationDelay: '-5s' }, size: 50 },
  ];

  return (
    <>
      {/* Dynamic Ambient Glow Layers */}
      <div className="bg-glow-layer">
        <div className="bg-glow-orb bg-glow-orb-1" />
        <div className="bg-glow-orb bg-glow-orb-2" />
      </div>

      {/* Grid Pattern Layer */}
      <div className="bg-grid-layer" />

      {/* Floating Career Signs Layer */}
      <div className="bg-signs-layer">
        {signs.map(({ Icon, style, size }, index) => (
          <div
            key={index}
            className="bg-sign-item"
            style={{
              ...style,
              width: size,
              height: size,
            }}
          >
            <Icon size={size} strokeWidth={1.2} />

            {/* Blueprint Theme Details: Drafting circles & crosshairs */}
            <div
              className="blueprint-details blueprint-draft-circle"
              style={{
                width: size * 2,
                height: size * 2,
                top: -size / 2,
                left: -size / 2,
              }}
            />
            <svg
              className="blueprint-details"
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                width: size + 20,
                height: size + 20,
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              <line
                x1="-10"
                y1={size / 2}
                x2={size + 20}
                y2={size / 2}
                stroke="var(--accent-border)"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <line
                x1={size / 2}
                y1="-10"
                x2={size / 2}
                y2={size + 20}
                stroke="var(--accent-border)"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
            </svg>

            {/* Cosmic Theme Details: Nebula sparkles & star connections */}
            <div
              className="cosmic-details"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size + 30,
                height: size + 30,
                border: '1px solid rgba(168, 85, 247, 0.15)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            <span
              className="cosmic-details"
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 4,
                height: 4,
                backgroundColor: '#FFF',
                borderRadius: '50%',
                boxShadow: '0 0 8px #FFF, 0 0 12px var(--accent)',
                animation: 'pulse 2s infinite alternate',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
