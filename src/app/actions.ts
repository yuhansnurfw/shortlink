'use server';

import crypto from 'crypto';

export async function shortenUrl(longUrl: string, customAlias?: string) {
  // Simulate network delay for effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Basic validation for URL
  try {
    new URL(longUrl);
  } catch (e) {
    return { error: 'Please enter a valid URL (e.g., https://example.com)' };
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

  const shortUrl = `5id.me/${code}`;

  // In a real app, you would check if the code already exists in the database
  // and save { code, longUrl } to the database here.
  
  return { success: true, shortUrl, originalUrl: longUrl };
}
