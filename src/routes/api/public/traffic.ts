import { createFileRoute } from '@tanstack/react-router';
import { trafficInput } from '@/lib/traffic';

export const Route = createFileRoute('/api/public/traffic')({
  server: { handlers: { POST: async ({ request }) => {
    // A cookieless, same-origin write-only collector; no private reads or visitor identifiers.
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return new Response(null, { status: 403 });
    if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1') return new Response(null, { status: 204 });
    if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 415 });
    const text = await request.text();
    if (text.length > 256) return new Response(null, { status: 413 });
    let input: unknown;
    try { input = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
    const parsed = trafficInput.safeParse(input);
    if (!parsed.success) return new Response(null, { status: 400 });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.rpc('record_traffic', { p_event: parsed.data.event, p_page: parsed.data.page, p_source: parsed.data.source });
    return new Response(null, { status: error ? 503 : 204, headers: { 'Cache-Control': 'no-store' } });
  } } },
});