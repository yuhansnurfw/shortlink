'use client';

import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  glowColor?: 'cyan' | 'purple';
}

export function NeonButton({ children, glowColor = 'cyan', className = '', ...props }: NeonButtonProps) {
  const glowClass = glowColor === 'cyan' ? 'hover:neon-glow-cyan' : 'hover:neon-glow-purple';
  const borderClass = glowColor === 'cyan' ? 'border-[--color-neon-cyan]/50' : 'border-[--color-neon-purple]/50';
  const textGlowClass = glowColor === 'cyan' ? 'hover:neon-text-cyan' : 'hover:neon-text-purple';

  return (
    <button
      className={`relative px-8 py-4 font-bold tracking-wider uppercase text-white rounded-xl border bg-black/40 transition-all duration-300 ${borderClass} ${glowClass} ${textGlowClass} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
