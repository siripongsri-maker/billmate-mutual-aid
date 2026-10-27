import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { Activity, Eye, Heart, RefreshCw, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTraffic } from '@/lib/traffic.functions';
import { trafficSummary } from '@/lib/traffic';
import { pageTitle } from '@/lib/brand';

export const Route = createFileRoute('/admin/analytics')({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: pageTitle('วิเคราะห์ยอดเข้าชม','th') }, { name:'description',content:'ยอดเข้าชม แหล่งที่มา และการกดบิลแบบสรุปรวมสำหรับทีม' }, { property:'og:title',content:pageTitle('วิเคราะห์ยอดเข้าชม','th') }, { property:'og:description',content:'สถิติการใช้งานแบบไม่ระบุตัวผู้เข้าชม สำหรับทีมงาน' }, { property:'og:type',content:'website' }, { name:'twitter:card',content:'summary' }, { name:'robots',content:'noindex,nofollow' }] }),
  component: Analytics,
});
const labels: Record<string,string> = {home:'หน้าแรก',browse:'บิลที่รอเรา',bill:'รายละเอียดบิล',help:'หน้าช่วยบิล',impact:'รวมกันคนละนิด',circles:'วงช่วยเหลือ',trust:'ความไว้ใจ',corporate:'องค์กรร่วมช่วย',onboarding:'เริ่มต้น',thanks:'ขอบคุณ',direct:'เข้าตรง / ไม่ทราบที่มา',google:'Google',bing:'Bing',facebook:'Facebook',instagram:'Instagram',line:'LINE',tiktok:'TikTok',other:'เว็บไซต์อื่น'};
const number = (n:number) => n.toLocaleString('th-TH');
function Ranking({ title, rows, total }: { title:string; rows:{label:string;count:number}[];total:number }) {
  return <section className="min-w-0 border-t border-border pt-6"><h3 className="text-lg font-semibold">{title}</h3>{rows.length === 0 ? <p className="py-8 text-muted-foreground">ยังไม่มีข้อมูลในช่วงนี้</p> : <ol className="mt-4 space-y-5">{rows.map((r,i) => <li key={r.label}><div className="mb-2 flex items-start justify-between gap-3 text-sm"><span>{i+1}. {labels[r.label] ?? r.label}</span><span className="shrink-0 font-semibold">{number(r.count)} <span className="font-normal text-muted-foreground">· {total ? Math.round(r.count/total*100) : 0}%</span></span></div><progress className="h-2 w-full overflow-hidden rounded-sm [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" max={Math.max(total,1)} value={r.count} aria-label={labels[r.label] ?? r.label}/></li>)}</ol>}</section>;
}
function Analytics() {
  const [days,setDays] = useState<7|30|90>(30);
  const read = useServerFn(getTraffic);
  // Existing admin layout mounts this child only after its session/staff check.
  const query = useQuery({queryKey:['traffic',days],queryFn:() => read({data:days}),retry:false,staleTime:30000});
  const totals = trafficSummary(query.data?.rows ?? []);
  const stats = [{label:'การเข้าชม',value:totals.visits,icon:Activity},{label:'เปิดหน้า',value:totals.views,icon:Eye},{label:'ดูรายละเอียดบิล',value:totals.billViews,icon:ArrowUpRight},{label:'กดช่วยบิล',value:totals.helpClicks,icon:Heart}];
  return <section className="space-y-8" aria-labelledby="traffic-title">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">สถิติการใช้งาน · เวลาไทย</p><h2 id="traffic-title" className="kl-page-heading">ยอดเข้าชม</h2></div><div className="flex items-center gap-3"><label className="sr-only" htmlFor="traffic-days">ช่วงเวลา</label><select id="traffic-days" value={days} onChange={e => setDays(Number(e.target.value) as 7|30|90)} className="min-h-11 rounded-md border border-input bg-background px-3 text-sm">{[7,30,90].map(d => <option value={d} key={d}>{d} วันล่าสุด</option>)}</select><Button variant="outline" size="icon" className="h-11 w-11" aria-label="รีเฟรชสถิติ" title="รีเฟรชสถิติ" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw className={query.isFetching?'animate-spin':''}/></Button></div></header>
    {query.isPending ? <p role="status" className="py-12 text-center text-muted-foreground">กำลังโหลดสถิติ…</p> : query.isError ? <div role="alert" className="space-y-3"><p>โหลดสถิติไม่ได้ หรือบัญชีนี้ยังไม่มีสิทธิ์ดูสถิติ</p><Button variant="outline" onClick={() => void query.refetch()}>ลองอีกครั้ง</Button></div> : <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(s => <div key={s.label} className="rounded-lg border border-border bg-card p-4"><div className="flex items-center gap-2 text-sm text-muted-foreground"><s.icon size={17}/>{s.label}</div><p className="mt-3 text-3xl font-semibold tabular-nums">{number(s.value)}</p><p className="mt-1 text-xs text-muted-foreground">ครั้ง</p></div>)}</div>
      {!totals.views && <p className="border-l-2 border-primary pl-4 text-muted-foreground">ยังไม่มีการเข้าชมในช่วงนี้ สถิติเริ่มนับหลังเพิ่มฟีเจอร์นี้ ไม่มียอดย้อนหลัง</p>}
      <section className="border-t border-border pt-6"><h3 className="text-lg font-semibold">เปิดหน้ารายวัน</h3><div className="mt-4 overflow-x-auto"><div className="flex h-40 min-w-full items-end gap-2" role="img" aria-label="ยอดเปิดหน้ารายวัน">{Array.from({length:days},(_,i) => { const date = new Date(`${query.data.today}T00:00:00Z`);date.setUTCDate(date.getUTCDate()-days+1+i);const key=date.toISOString().slice(0,10);const count=totals.daily.find(d=>d.label===key)?.count ?? 0;const max=Math.max(...totals.daily.map(d=>d.count),1);return <div className="flex h-full min-w-2 flex-1 flex-col justify-end" key={key} title={`${key}: ${count} ครั้ง`}><svg viewBox="0 0 10 100" preserveAspectRatio="none" className="h-full w-full text-primary" aria-hidden="true"><rect x="0" y={100-count/max*100} width="10" height={Math.max(count/max*100,1)} fill="currentColor"/></svg></div>;})}</div></div><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{days} วันล่าสุด</span><span>วันนี้ · {query.data.today}</span></div></section>
      <div className="grid gap-8 lg:grid-cols-2"><Ranking title="แหล่งที่มา" rows={totals.sources} total={totals.visits}/><Ranking title="หน้ายอดนิยม" rows={totals.pages} total={totals.views}/></div>
    </>}
    <aside className="flex gap-3 border-t border-border pt-5 text-sm text-muted-foreground"><ShieldCheck size={20} className="shrink-0 text-primary"/><div className="space-y-2"><p>นับเป็นครั้ง ไม่ใช่จำนวนคน และการกดช่วยไม่ใช่ยอดเงินหรือการชำระสำเร็จ</p><p>เก็บเฉพาะยอดรวมรายวัน 90 วัน ไม่เก็บชื่อ IP รหัสผู้เข้าชม ข้อมูลบิล ข้อความ หรือ URL เต็ม ไม่มีคุกกี้ติดตาม และไม่ส่งสถิติเมื่อเปิด Do Not Track / Global Privacy Control</p><p>ยอดเก่าเกิน 90 วันไม่แสดง และลบเมื่อมีการนับครั้งถัดไป แหล่งที่มาอาจไม่ครบเมื่อเบราว์เซอร์ไม่ส่งข้อมูลอ้างอิง</p></div></aside>
  </section>;
}