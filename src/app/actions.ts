'use server';

import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function login(password: string) {
  const correctPassword = process.env.APP_PASSWORD || 'Yuhans123@';
  
  if (password === correctPassword) {
    // Set a secure HTTP-only cookie that expires in 30 days
    (await cookies()).set('auth', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', 
      maxAge: 60 * 60 * 24 * 30 
    });
    return { success: true };
  }
  
  return { error: 'Incorrect password. Access denied.' };
}

export async function shortenUrl(longUrl: string, customAlias?: string) {
  // Check Authentication
  const authCookie = (await cookies()).get('auth');
  if (authCookie?.value !== 'true') {
    return { error: 'Unauthorized: You must login first.' };
  }

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

export async function getLinks() {
  const authCookie = (await cookies()).get('auth');
  if (authCookie?.value !== 'true') {
    return { error: 'Unauthorized: You must login first.' };
  }

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return { error: `Database Error: ${error.message || JSON.stringify(error)}` };
  }

  return { success: true, links: data };
}

export async function deleteLink(id: string) {
  const authCookie = (await cookies()).get('auth');
  if (authCookie?.value !== 'true') {
    return { error: 'Unauthorized: You must login first.' };
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return { error: `Database Error: ${error.message || JSON.stringify(error)}` };
  }

  return { success: true };
}

export async function updateLink(id: string, newUrl: string) {
  const authCookie = (await cookies()).get('auth');
  if (authCookie?.value !== 'true') {
    return { error: 'Unauthorized: You must login first.' };
  }

  let formattedUrl = newUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    new URL(formattedUrl);
  } catch (e) {
    return { error: 'Please enter a valid URL' };
  }

  const { error } = await supabase
    .from('links')
    .update({ original_url: formattedUrl })
    .eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return { error: `Database Error: ${error.message || JSON.stringify(error)}` };
  }

  return { success: true, originalUrl: formattedUrl };
}
