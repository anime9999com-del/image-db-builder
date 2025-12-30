import { MessageCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <MessageCircle className={`${iconSizes[size]} text-primary fill-primary`} />
        <MessageCircle className={`${iconSizes[size]} text-primary fill-primary absolute top-0 left-1 opacity-60 -rotate-12`} />
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-foreground`}>
          BaatCheet
        </span>
      )}
    </div>
  );
}
