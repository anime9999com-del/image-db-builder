export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep dark gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(30, 64, 175, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 10% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse 40% 60% at 90% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
            linear-gradient(180deg, hsl(222, 47%, 6%) 0%, hsl(222, 47%, 4%) 50%, hsl(222, 47%, 2%) 100%)
          `
        }}
      />
      
      {/* Bokeh light effects */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute w-[200px] h-[200px] rounded-full blur-[80px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 70%)',
          top: '60%',
          left: '30%',
          animation: 'pulse 6s ease-in-out infinite 1s'
        }}
      />
      <div 
        className="absolute w-[250px] h-[250px] rounded-full blur-[90px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, transparent 70%)',
          top: '40%',
          right: '15%',
          animation: 'pulse 7s ease-in-out infinite 2s'
        }}
      />
      <div 
        className="absolute w-[150px] h-[150px] rounded-full blur-[60px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
          bottom: '20%',
          right: '30%',
          animation: 'pulse 5s ease-in-out infinite 0.5s'
        }}
      />
      
      {/* Subtle city light shimmer */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.8), transparent)
          `,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  );
}
