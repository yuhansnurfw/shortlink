import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Await params since it can be asynchronous in Next.js 15
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { data, error } = await supabase
    .from('links')
    .select('original_url')
    .eq('id', slug)
    .single();

  if (error || !data) {
    // If not found, redirect to home page or a 404 page
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to the original URL
  return NextResponse.redirect(data.original_url);
}
