'use client';

import React, { useState } from 'react';
import { UrlInput } from './ui/UrlInput';
import { NeonButton } from './ui/NeonButton';
import { login } from '@/app/actions';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await login(password);
      if (res.error) {
        setError(res.error);
      } else {
        // Refresh the page to trigger the Server Component to read the cookie and render the ShortenForm
        window.location.reload();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">Restricted Access</h2>
        <p className="text-gray-400 text-sm">Please enter the password to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <UrlInput
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <NeonButton type="submit" disabled={isLoading} className="w-full h-[58px]">
          {isLoading ? 'Verifying...' : 'Unlock'}
        </NeonButton>
      </form>
    </div>
  );
}
