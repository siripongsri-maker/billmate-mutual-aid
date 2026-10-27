import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Copy,Link as LinkIcon,RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bills,circles } from '@/lib/data';
import { createShareLink,getShareStats } from '@/lib/share-links.functions';
import { shareChannels,summarizeShares,targetTitle,type ShareLink } from '@/lib/share-links';
import { toast } from 'sonner';

const channelNames:Record<string,string>={line:'LINE',facebook:'Facebook',instagram:'Instagram',tiktok:'TikTok',other:'อื่น ๆ'};
export function ShareLinksPanel({days}:{days:7|30|90}) {
  const [target,setTarget]=useState('bill:b1');
  const [channel,setChannel]=useState<ShareLink['channel']>('line');
  const [busy,setBusy]=useState(false);
  const create=useServerFn(createShareLink);const read=useServerFn(getShareStats);
  const query=useQuery({queryKey:['share-stats',days],queryFn:()=>read({data:days}),retry:false});
  const rows=summarizeShares(query.data?.links??[],query.data?.counts??[]);
  const copy=async(code:string)=>{try{await navigator.clipboard.writeText(`${window.location.origin}/s/${code}`);toast.success('คัดลอกลิงก์แล้ว');}catch{toast.error('คัดลอกไม่ได้ ลองอีกครั้ง');}};
  const submit=async()=>{
    const [kind,id]=target.split(':');if((kind!=='bill' && kind!=='circle') || !id)return;
    setBusy(true);try{const link=await create({data:{kind,target_id:id,channel}});await query.refetch();await copy(link.code);}catch{toast.error('สร้างลิงก์ไม่ได้ ลองอีกครั้ง');}finally{setBusy(false);}
  };
  return <section className="space-y-5 border-t border-border pt-6" aria-labelledby="share-panel-heading">
    <div className="flex items-center justify-between gap-3"><h3 id="share-panel-heading" className="text-lg font-semibold">ผลลิงก์แชร์แยกช่องทาง</h3><Button variant="ghost" size="icon" aria-label="รีเฟรชลิงก์แชร์" title="รีเฟรชลิงก์แชร์" disabled={query.isFetching} onClick={()=>void query.refetch()}><RefreshCw/></Button></div>
    <p className="text-sm text-muted-foreground">บิลและวงตัวอย่าง · ไม่มีการรับเงินจริง · ยอด {days} วันล่าสุด</p>
    <div className="flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-sm">บิลหรือวงช่วยเหลือ<select className="mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3" value={target} onChange={e=>setTarget(e.target.value)}><optgroup label="บิลตัวอย่าง">{bills.map(b=><option key={b.id} value={`bill:${b.id}`}>{b.title.th}</option>)}</optgroup><optgroup label="วงตัวอย่าง">{circles.map(c=><option key={c.id} value={`circle:${c.id}`}>{c.name.th}</option>)}</optgroup></select></label><label className="text-sm">ช่องทาง<select className="mt-2 block min-h-11 rounded-md border border-input bg-background px-3" value={channel} onChange={e=>setChannel(e.target.value as ShareLink['channel'])}>{shareChannels.map(c=><option key={c} value={c}>{channelNames[c]}</option>)}</select></label><Button className="min-h-11" disabled={busy} onClick={()=>void submit()}><LinkIcon/>{busy?'กำลังสร้าง…':'สร้างและคัดลอก'}</Button></div>
    {query.isPending?<p role="status">กำลังโหลดลิงก์…</p>:query.isError?<p role="alert">โหลดลิงก์ไม่สำเร็จ</p>:!rows.length?<p className="py-6 text-muted-foreground">ยังไม่มีลิงก์แชร์</p>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border text-muted-foreground"><tr>{['บิล / วง','ช่องทาง','เปิด','กดช่วย','เข้าร่วม','กดแชร์','ลิงก์'].map(t=><th className="whitespace-nowrap px-3 py-3 font-medium" key={t}>{t}</th>)}</tr></thead><tbody>{rows.map(r=><tr className="border-b border-border" key={r.code}><td className="min-w-44 px-3 py-4"><a href={`/s/${r.code}`} className="font-medium text-primary underline underline-offset-4">{targetTitle(r)}</a><span className="mt-1 block text-xs text-muted-foreground">{r.kind==='bill'?'บิลตัวอย่าง':'วงตัวอย่าง'}</span></td><td className="px-3">{channelNames[r.channel]}</td>{[r.opens,r.help,r.joins,r.shares].map((n,i)=><td key={i} className="px-3 tabular-nums">{n.toLocaleString('th-TH')}</td>)}<td className="px-3"><Button variant="outline" size="icon" aria-label={`คัดลอกลิงก์ ${channelNames[r.channel]} ${targetTitle(r)}`} title="คัดลอกลิงก์" onClick={()=>void copy(r.code)}><Copy/></Button></td></tr>)}</tbody></table></div>}
    <p className="text-xs text-muted-foreground">ช่องทางตามลิงก์ที่เลือก ไม่ใช่การยืนยันว่าเปิดจากแอปนั้น · นับครั้ง ไม่ใช่คน · กดช่วยและเข้าร่วมเป็นการทดลอง ไม่ใช่ยอดเงิน</p>
  </section>;
}