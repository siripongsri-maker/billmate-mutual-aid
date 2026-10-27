import { z } from 'zod';
import { bills, circles } from './data';

export const shareChannels = ['line','facebook','instagram','tiktok','other'] as const;
export const shareCode = z.string().regex(/^[a-f0-9]{24}$/);
export const shareInput = z.object({kind:z.enum(['bill','circle']),target_id:z.string(),channel:z.enum(shareChannels)}).strict().refine(v => v.kind === 'bill' ? bills.some(b=>b.id===v.target_id) : circles.some(c=>c.id===v.target_id), 'Unknown destination');
export const shareEvent = z.object({code:shareCode,event:z.enum(['open','help_click','join_click','share_click'])}).strict();
export type ShareLink = {code:string;kind:'bill'|'circle';target_id:string;channel:typeof shareChannels[number]};
export type ShareCount = {code:string;event:'open'|'help_click'|'join_click'|'share_click';count:number;day:string};
export function summarizeShares(links:ShareLink[],rows:ShareCount[]) {
  return links.map(link => {
    const sum = (event:ShareCount['event']) => rows.filter(r=>r.code===link.code && r.event===event).reduce((n,r)=>n+Number(r.count),0);
    return {...link,opens:sum('open'),help:sum('help_click'),joins:sum('join_click'),shares:sum('share_click')};
  });
}
export function targetTitle(link: Pick<ShareLink,'kind'|'target_id'>) {
  return link.kind==='bill' ? bills.find(b=>b.id===link.target_id)?.title.th ?? 'ไม่พบบิล' : circles.find(c=>c.id===link.target_id)?.name.th ?? 'ไม่พบวง';
}