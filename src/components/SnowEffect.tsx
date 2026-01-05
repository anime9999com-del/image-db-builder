import { useMemo } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

export const SnowEffect = () => {
  const snowflakes = useMemo(() => {
    const flakes: Snowflake[] = [];
    const count = 50; // Balanced for performance and visual effect
    
    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2, // 2-6px
        duration: Math.random() * 8 + 10, // 10-18s fall time
        delay: Math.random() * -15, // Stagger start times
        opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 opacity for subtlety
        drift: Math.random() * 40 - 20, // Horizontal drift -20px to +20px
      });
    }
    return flakes;
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/90"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            '--drift': `${flake.drift}px`,
            filter: flake.size > 4 ? 'blur(0.5px)' : 'none',
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
          } as React.CSSProperties}
        />
      ))}
      
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--drift) * 0.5)) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift)) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(calc(var(--drift) * 0.5)) rotate(270deg);
          }
          100% {
            transform: translateY(105vh) translateX(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
