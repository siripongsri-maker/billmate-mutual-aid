import { z } from 'zod';

export const trafficInput = z.object({
  event: z.enum(['visit', 'page_view', 'bill_view', 'help_click']),
  page: z.enum(['home', 'browse', 'bill', 'help', 'impact', 'circles', 'trust', 'corporate', 'onboarding', 'thanks']),
  source: z.enum(['direct', 'google', 'bing', 'facebook', 'instagram', 'line', 'tiktok', 'other']),
}).strict();
export type TrafficRow = z.infer<typeof trafficInput> & { day: string; count: number };
export const trafficDays = z.union([z.literal(7), z.literal(30), z.literal(90)]);
export function trafficSummary(rows: TrafficRow[]) {
  const sum = (event: TrafficRow['event']) => rows.filter(r => r.event === event).reduce((n, r) => n + Number(r.count), 0);
  const group = (event: TrafficRow['event'], key: 'page' | 'source' | 'day') => {
    const values = new Map<string, number>();
    rows.filter(r => r.event === event).forEach(r => values.set(r[key], (values.get(r[key]) ?? 0) + Number(r.count)));
    return [...values].map(([label, count]) => ({ label, count })).sort((a,b) => b.count-a.count);
  };
  return { visits: sum('visit'), views: sum('page_view'), billViews: sum('bill_view'), helpClicks: sum('help_click'), sources: group('visit', 'source'), pages: group('page_view', 'page'), daily: group('page_view', 'day').sort((a,b) => a.label.localeCompare(b.label)) };
}