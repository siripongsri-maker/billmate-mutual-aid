import { createFileRoute } from '@tanstack/react-router';
import { shareEvent } from '@/lib/share-links';

export const Route=createFileRoute('/api/public/share-event')({staticData:{sitemap:false},server:{handlers:{POST:async({request})=>{
  const origin=request.headers.get('origin');
  if(!origin || origin!==new URL(request.url).origin || request.headers.get('sec-fetch-site')==='cross-site')return new Response(null,{status:403});
  if(request.headers.get('dnt')==='1' || request.headers.get('sec-gpc')==='1')return new Response(null,{status:204});
  if(!request.headers.get('content-type')?.startsWith('application/json'))return new Response(null,{status:415});
  const body=await request.text();if(body.length>256)return new Response(null,{status:413});
  let input:unknown;try{input=JSON.parse(body);}catch{return new Response(null,{status:400});}
  const parsed=shareEvent.safeParse(input);if(!parsed.success)return new Response(null,{status:400});
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error}=await supabaseAdmin.rpc('record_share',{p_code:parsed.data.code,p_event:parsed.data.event});
  return new Response(null,{status:error?400:204,headers:{'Cache-Control':'no-store'}});
}}}});