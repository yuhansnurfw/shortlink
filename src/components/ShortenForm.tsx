'use client';

import React, { useState } from 'react';
import { UrlInput } from './ui/UrlInput';
import { NeonButton } from './ui/NeonButton';
import { shortenUrl } from '@/app/actions';

export function ShortenForm() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      // Pass the alias if provided
      const res = await shortenUrl(url, alias.trim() !== '' ? alias.trim() : undefined);
      if (res.error) {
        setResult({ error: res.error });
      } else if (res.shortUrl) {
        setResult({ shortUrl: res.shortUrl });
        setUrl(''); // Clear inputs on success
        setAlias('');
      }
    } catch (err) {
      setResult({ error: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-8 md:p-12 space-y-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <UrlInput
            type="text"
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={isLoading}
          />
          <NeonButton type="submit" disabled={isLoading} className="w-full md:w-auto shrink-0 disabled:opacity-50 h-[58px]">
            {isLoading ? 'Processing...' : 'Shorten URL'}
          </NeonButton>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-gray-400 font-medium bg-black/40 px-4 py-3 rounded-xl border border-white/10 shrink-0 h-[52px] flex items-center">
            5id.me/
          </span>
          <UrlInput
            type="text"
            placeholder="custom-alias (optional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            disabled={isLoading}
            className="!py-3 !px-4 h-[52px]"
          />
        </div>
      </form>

      {result?.error && (
        <div className="text-red-400 text-sm mt-2 text-left px-2">
          {result.error}
        </div>
      )}

      {/* Result Area */}
      {result?.shortUrl && (
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex-1 truncate text-left w-full">
            <span className="text-gray-500 text-sm block mb-1">Your shortened link:</span>
            <a 
              href={`https://${result.shortUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[--color-neon-cyan] neon-text-cyan hover:underline text-lg font-medium tracking-wide"
            >
              {result.shortUrl}
            </a>
          </div>
          <button 
            onClick={handleCopy}
            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors text-sm"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
