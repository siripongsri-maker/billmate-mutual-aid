import { useEffect,useRef,useState } from 'react';
import { createFileRoute,notFound } from '@tanstack/react-router';
import { queryOptions,useSuspenseQuery } from '@tanstack/react-query';
import { Copy,Heart,Users,Share2,ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { KlShell } from '@/components/kl/KlShell';
import { Button } from '@/components/ui/button';
import { resolveShareLink } from '@/lib/share-links.functions';
import { bills,circles,fmt } from '@/lib/data';
import { targetTitle } from '@/lib/share-links';
import { sendShareEvent } from '@/lib/share-tracking';
import { pageTitle } from '@/lib/brand';

const shareQuery=(code:string)=>queryOptions({queryKey:['public-share',code],queryFn:async()=>{if(!/^[a-f0-9]{24}$/.test(code))throw notFound();const link=await resolveShareLink({data:code});if(!link)throw notFound();return link;}});
export const Route=createFileRoute('/s/$code')({
  staticData:{sitemap:false},
  loader:({params,context})=>context.queryClient.ensureQueryData(shareQuery(params.code)),
  head:({loaderData})=>({meta:[{title:pageTitle(loaderData?targetTitle(loaderData):'ลิงก์แชร์','th')},{name:'description',content:'บิลและวงช่วยเหลือตัวอย่าง ไม่มีการรับเงินจริง'},{property:'og:title',content:pageTitle(loaderData?targetTitle(loaderData):'ลิงก์แชร์','th')},{property:'og:description',content:'ร่วมทดลองช่วยกันแบ่งเบาบิล โดยไม่ใช้เงินจริงหรือข้อมูลส่วนตัว'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),
  notFoundComponent:()=> <KlShell title="ไม่พบลิงก์นี้"><p className="py-8">ลิงก์อาจไม่ถูกต้องหรือไม่พร้อมใช้งาน</p><Button asChild variant="outline"><a href="/">กลับหน้าแรก</a></Button></KlShell>,
  component:ShareDestination,
});
function ShareDestination(){
  const {code}=Route.useParams();const {data:link}=useSuspenseQuery(shareQuery(code));
  const opened=useRef('');const [joined,setJoined]=useState(false);const [helped,setHelped]=useState(false);const [amount,setAmount]=useState(20);
  useEffect(()=>{if(opened.current===code)return;opened.current=code;sendShareEvent(code,'open');setJoined(false);setHelped(false);},[code]);
  const bill=bills.find(b=>b.id===link.target_id);const circle=circles.find(c=>c.id===link.target_id);
  const copy=async()=>{sendShareEvent(code,'share_click');try{await navigator.clipboard.writeText(window.location.href);toast.success('คัดลอกลิงก์แล้ว');}catch{toast.error('คัดลอกไม่ได้ ลองอีกครั้ง');}};
  return <KlShell title={targetTitle(link)}><div className="mx-auto max-w-2xl space-y-6 pb-10">
    <div className="border-l-4 border-primary bg-primary-soft px-4 py-3 text-sm font-medium" role="note">DEMO · บิล วง และยอดทั้งหมดเป็นข้อมูลสมมติ ไม่มีการรับเงินจริง</div>
    <div className="flex justify-between gap-3"><Button asChild variant="ghost"><a href="/"><ArrowLeft/>หน้าแรก</a></Button><Button variant="outline" onClick={()=>void copy()}><Share2/>แชร์ลิงก์นี้</Button></div>
    {link.kind==='bill' && bill ? <>
      <section className="space-y-4"><p className="text-sm text-muted-foreground">บิลตัวอย่าง · {bill.name}</p><h2 className="text-2xl font-semibold">{bill.title.th}</h2><p className="leading-relaxed">{bill.story.th}</p><div className="flex justify-between text-sm"><span>ยอดสมมติ {fmt(bill.raised)}</span><span>เป้าหมาย {fmt(bill.goal)}</span></div><progress className="h-3 w-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" value={bill.raised} max={bill.goal} aria-label="ความคืบหน้าบิลตัวอย่าง"/></section>
      <section className="space-y-4 border-t border-border pt-6"><h3 className="font-semibold">ทดลองช่วยบิล</h3><div className="flex flex-wrap gap-2">{[20,50,100].map(n=><Button key={n} variant={amount===n?'default':'outline'} aria-pressed={amount===n} onClick={()=>setAmount(n)}>{fmt(n)}</Button>)}</div><Button disabled={helped || bill.raised>=bill.goal} className="min-h-11" onClick={()=>{sendShareEvent(code,'help_click');setHelped(true);}}><Heart/>{bill.raised>=bill.goal?'บิลตัวอย่างนี้ครบยอดแล้ว':helped?'ทดลองช่วยแล้ว':'ทดลองช่วยบิล'}</Button>{helped && <p role="status" className="text-primary">บันทึกการกดทดลองช่วย {fmt(amount)} แล้ว ไม่มีการเรียกเก็บเงิน</p>}</section>
    </>:link.kind==='circle' && circle?<>
      <section className="space-y-4"><div className="text-5xl" aria-hidden="true">{circle.emoji}</div><h2 className="text-2xl font-semibold">{circle.name.th}</h2><p>{circle.desc.th}</p><p className="text-sm text-muted-foreground">สมาชิกสมมติ {circle.members.toLocaleString('th-TH')} คน · กองกลางสมมติ {fmt(circle.pool)}</p><Button className="min-h-11" disabled={joined} onClick={()=>{sendShareEvent(code,'join_click');setJoined(true);}}><Users/>{joined?'เข้าร่วมทดลองแล้ว':'ทดลองเข้าร่วมวง'}</Button>{joined && <p role="status" className="text-primary">เข้าร่วมแบบทดลองแล้ว ไม่ได้สร้างสมาชิกจริง</p>}</section><section className="border-t border-border pt-6"><h3 className="mb-4 font-semibold">บิลตัวอย่างในวง</h3>{bills.filter(b=>b.category===circle.focus).map(b=><div key={b.id} className="flex justify-between gap-3 border-b border-border py-4"><span>{b.title.th}</span><span className="shrink-0 text-muted-foreground">{fmt(b.goal)}</span></div>)}</section>
    </>:<p>ไม่พบข้อมูลตัวอย่างนี้</p>}
    <p className="border-t border-border pt-5 text-xs text-muted-foreground">นับการเปิดลิงก์และการกดเป็นยอดรวม ไม่ติดตามตัวบุคคล ไม่ใช้คุกกี้ และเคารพ Do Not Track / Global Privacy Control</p>
  </div></KlShell>;
}