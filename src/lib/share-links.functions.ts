import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { shareInput,shareCode,type ShareLink,type ShareCount } from './share-links';
import { trafficDays } from './traffic';

export const createShareLink = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v:unknown)=>shareInput.parse(v)).handler(async({data,context})=>{
  setResponseHeader('Cache-Control','no-store');
  const {data:allowed,error:roleError} = await context.supabase.rpc('can_read_analytics');
  if (roleError || !allowed) throw new Error('Forbidden: analytics staff only');
  const lookup = () => context.supabase.from('share_links').select('code,kind,target_id,channel').eq('kind',data.kind).eq('target_id',data.target_id).eq('channel',data.channel).maybeSingle();
  const existing = await lookup();
  if(existing.error) throw new Error('Unable to load share link');
  if(existing.data) return existing.data as ShareLink;
  const code = crypto.randomUUID().replaceAll('-','').slice(0,24);
  const result = await context.supabase.from('share_links').insert({...data,code}).select('code,kind,target_id,channel').single();
  if(result.error?.code==='23505') {const raced=await lookup();if(raced.data)return raced.data as ShareLink;}
  if(result.error || !result.data) throw new Error('Unable to create share link');
  return result.data as ShareLink;
});
export const getShareStats = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((v:unknown)=>trafficDays.parse(v)).handler(async({data:days,context})=>{
  setResponseHeader('Cache-Control','no-store');
  const {data:allowed,error:roleError} = await context.supabase.rpc('can_read_analytics');
  if(roleError || !allowed) throw new Error('Forbidden: analytics staff only');
  const today=new Date(Date.now()+7*3600000).toISOString().slice(0,10);
  const start=new Date(`${today}T00:00:00Z`);start.setUTCDate(start.getUTCDate()-days+1);
  const [links,counts]=await Promise.all([
    context.supabase.from('share_links').select('code,kind,target_id,channel').order('created_at',{ascending:false}),
    context.supabase.from('share_daily').select('code,event,count,day').gte('day',start.toISOString().slice(0,10)).lte('day',today).limit(40000),
  ]);
  if(links.error || counts.error)throw new Error('Unable to load share totals');
  return {links:(links.data??[]) as ShareLink[],counts:(counts.data??[]) as ShareCount[]};
});
export const resolveShareLink = createServerFn({method:'GET'}).inputValidator((v:unknown)=>shareCode.parse(v)).handler(async({data:code})=>{
  const key=process.env['SUPABASE_ANON_KEY'];const url=process.env['SUPABASE_URL'];
  if(!key || !url)throw new Error('Share links unavailable');
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_') && h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
  const {data,error}=await client.from('share_links').select('code,kind,target_id,channel').eq('code',code).maybeSingle();
  if(error)throw new Error('Share link unavailable');
  return data as ShareLink|null;
});