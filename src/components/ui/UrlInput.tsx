'use client';

import React from 'react';

interface UrlInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function UrlInput({ className = '', ...props }: UrlInputProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[--color-neon-cyan] to-[--color-neon-purple] rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500 group-hover:opacity-75"></div>
      <input
        className={`relative w-full bg-black/60 text-white placeholder-gray-400 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[--color-neon-cyan]/50 transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  );
}
