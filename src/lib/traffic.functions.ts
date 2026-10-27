import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { trafficDays, type TrafficRow } from './traffic';

export const getTraffic = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => trafficDays.parse(input))
  .handler(async ({ data: days, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { data: allowed, error: roleError } = await context.supabase.rpc('can_read_analytics');
    if (roleError || !allowed) throw new Error('Forbidden: staff only');
    const now = new Date();
    const today = new Date(now.getTime() + 7 * 3600000).toISOString().slice(0,10);
    const start = new Date(`${today}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - days + 1);
    const { data, error } = await context.supabase.from('traffic_daily').select('day,event,page,source,count').gte('day', start.toISOString().slice(0,10)).lte('day', today).order('day').limit(10000);
    if (error) throw new Error('Unable to load analytics');
    return { rows: (data ?? []) as TrafficRow[], today };
  });