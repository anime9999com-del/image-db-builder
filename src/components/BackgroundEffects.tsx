export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main gradient mesh */}
      <div className="absolute inset-0 bg-mesh" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      
      {/* Floating orbs */}
      <div 
        className="floating-orb w-[600px] h-[600px] -top-40 -right-40 bg-primary/20"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="floating-orb w-[400px] h-[400px] top-1/2 -left-20 bg-accent/15"
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="floating-orb w-[300px] h-[300px] bottom-20 right-1/4 bg-primary/10"
        style={{ animationDelay: '4s' }}
      />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
