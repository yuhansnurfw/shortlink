'use server';

import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function shortenUrl(longUrl: string, customAlias?: string) {
  // Basic validation for URL
  let formattedUrl = longUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    new URL(formattedUrl);
  } catch (e) {
    return { error: 'Please enter a valid URL (e.g., google.com or https://google.com)' };
  }

  let code = '';

  if (customAlias) {
    // Validate custom alias: only alphanumeric, dash, and underscore allowed.
    // This prevents SQL injection, spaces, and Unicode characters.
    const aliasRegex = /^[a-zA-Z0-9-_]+$/;
    if (!aliasRegex.test(customAlias)) {
      return { 
        error: 'Custom alias must only contain letters, numbers, dashes (-), and underscores (_).' 
      };
    }
    code = customAlias;
  } else {
    // Generate a random 6-character code as fallback if not provided
    code = crypto.randomBytes(3).toString('hex');
  }

  // Save to Supabase
  const { error } = await supabase
    .from('links')
    .insert([{ id: code, original_url: formattedUrl }]);

  if (error) {
    if (error.code === '23505' || error.message.includes('duplicate key')) {
      return { error: 'Alias is already taken. Please try another one.' };
    }
    console.error('Supabase error:', error);
    return { error: `Database Error: ${error.message || JSON.stringify(error)}` };
  }

  const shortUrl = `5id.me/${code}`;
  
  return { success: true, shortUrl, originalUrl: formattedUrl };
}
