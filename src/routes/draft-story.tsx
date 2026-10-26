import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Copy, LoaderCircle } from 'lucide-react';
import { useSession } from '@/lib/auth';
import { draftStory } from '@/lib/story-draft.functions';
import { storyInputSchema, hasPrivateIdentifiers } from '@/lib/story-draft';
import { KlShell } from '@/components/kl/KlShell';
import { Btn } from '@/components/ui-kit';
export const Route = createFileRoute('/draft-story')({
 staticData:{sitemap:false},
 head:()=>({meta:[{title:'ร่างคำขอด้วย AI — คนละนิด'},{name:'description',content:'ร่างเรื่องราวจากรายละเอียดบิล ตรวจความเป็นส่วนตัวและแก้ไขก่อนนำไปใช้'},{property:'og:title',content:'ร่างคำขอด้วย AI — คนละนิด'},{property:'og:description',content:'ตัวช่วยร่างคำขอที่ชัดเจนและคำนึงถึงความเป็นส่วนตัว'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:StoryDraftPage,
});
function StoryDraftPage(){
 const {session,loading}=useSession(); const generate=useServerFn(draftStory);
 const [category,setCategory]=useState('ค่าไฟ'); const [amount,setAmount]=useState(''); const [dueDate,setDueDate]=useState(''); const [situation,setSituation]=useState('');
 const [review,setReview]=useState(false); const [consent,setConsent]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 const [draft,setDraft]=useState<{title:string;story:string}|null>(null); const [copied,setCopied]=useState(false);
 const input={category,amount:Number(amount),dueDate,situation,consent:true};
 const field='mt-2 w-full rounded-lg border border-input bg-card px-3 py-3 text-foreground';
 function check(){const result=storyInputSchema.safeParse(input);if(!result.success){setError(hasPrivateIdentifiers(situation)?'ลบเบอร์โทร อีเมล เลขบัญชี เลขบัตร ลิงก์ และรหัสลับก่อนส่ง':'กรอกยอด วันครบกำหนด และสถานการณ์ 15–1500 ตัวอักษร');return;}setError('');setConsent(false);setReview(true);}
 async function submit(){if(!session||!consent||busy)return;setBusy(true);setError('');try{const result=await generate({data:{...input,consent:true}});if(result.ok){setDraft(result.draft);setReview(false);setCopied(false);}else setError(result.message);}catch{setError('ร่างไม่สำเร็จ ตรวจการเข้าสู่ระบบแล้วลองใหม่ ข้อมูลที่กรอกยังอยู่');}finally{setBusy(false);}}
 return <KlShell title="ร่างคำขอด้วย AI"><div className="mx-auto max-w-3xl pb-12">
 <a href="/konlanid/index.html#/request" className="mb-6 inline-flex items-center gap-2 text-primary"><ArrowLeft size={18}/>กลับหน้าขอความช่วยเหลือ</a>
 <div className="mb-6 flex items-start gap-3 border-b border-border pb-5"><ShieldCheck className="mt-1 shrink-0 text-primary"/><p className="text-sm text-muted-foreground">รายละเอียดจริงสำหรับร่างข้อความเท่านั้น ไม่รับเอกสาร เลขบัตร บัญชี หรือรหัสลับ ไม่มีการโอนเงินจริงหรือเผยแพร่จากหน้านี้</p></div>
 {loading?<p role="status">กำลังตรวจการเข้าสู่ระบบ…</p>:!session?<div className="py-8"><h2 className="mb-4 text-xl font-semibold">เข้าสู่ระบบเพื่อร่างคำขอ</h2><Link to="/login" search={{next:'/draft-story'}} className="text-primary underline">เข้าสู่ระบบ</Link></div>:<>
 {!review&&<form onSubmit={e=>{e.preventDefault();check();}} className="space-y-5">
 <div className="grid gap-5 sm:grid-cols-2"><label>ประเภทบิล<select className={field} value={category} onChange={e=>setCategory(e.target.value)}>{['ค่าไฟ','ค่าน้ำ','ค่าเช่า','ค่ารักษาพยาบาล','ค่าเรียน','อื่น ๆ'].map(v=><option key={v}>{v}</option>)}</select></label><label>ยอดที่ต้องการความช่วยเหลือ (บาท)<input className={field} type="number" min="0.01" max="1000000" step="0.01" required value={amount} onChange={e=>setAmount(e.target.value)}/></label></div>
 <label className="block">วันครบกำหนด<input className={field} type="date" required value={dueDate} onChange={e=>setDueDate(e.target.value)}/></label>
 <label className="block">สถานการณ์โดยไม่ระบุตัวบุคคล<textarea className={field} rows={6} minLength={15} maxLength={1500} required value={situation} onChange={e=>setSituation(e.target.value)} placeholder="เช่น รายได้ช่วงนี้ลดลง จึงยังจ่ายค่าไฟเดือนนี้ไม่ครบ"/><span className="mt-2 block text-sm text-muted-foreground">ไม่ใส่ชื่อ ที่อยู่ นายจ้าง โรงเรียน โรงพยาบาล หรือรายละเอียดสุขภาพที่ระบุตัวคุณได้ · {situation.length}/1500</span></label>
 <Btn type="submit"><ShieldCheck size={18}/>ตรวจข้อมูลก่อนส่ง AI</Btn></form>}
 {review&&<section className="space-y-5" aria-label="ตรวจข้อมูลก่อนส่ง AI"><h2 className="text-xl font-semibold">ข้อมูลที่จะส่งให้ AI</h2><div className="space-y-2 border-y border-border py-4"><p>ประเภทบิล: {category}</p><p>ยอด: {Number(amount).toLocaleString('th-TH')} บาท</p><p>ครบกำหนด: {dueDate}</p></div><p className="whitespace-pre-wrap break-words">{situation}</p><p className="text-sm text-muted-foreground">ตรวจและลบข้อมูลระบุตัวบุคคลด้วยตัวเองอีกครั้ง การตรวจอัตโนมัติไม่ครอบคลุมทั้งหมด ข้อความนี้จะส่งผ่าน AI Gateway ไปยังโมเดล แอปไม่บันทึกร่างหรือรายละเอียดลงฐานข้อมูลหรือบนเครื่องอัตโนมัติ</p><label className="flex items-start gap-3"><input type="checkbox" className="mt-1" checked={consent} disabled={busy} onChange={e=>setConsent(e.target.checked)}/><span>ตรวจแล้วว่าไม่มีข้อมูลระบุตัวบุคคล และยินยอมส่งข้อมูลข้างต้นให้ AI ร่างข้อความ</span></label><div className="flex flex-wrap gap-3"><Btn onClick={submit} disabled={!consent||busy}>{busy?<LoaderCircle className="animate-spin" size={18}/>:<Sparkles size={18}/>} {busy?'กำลังร่าง…':'ร่างเรื่องราว'}</Btn><Btn variant="outline" disabled={busy} onClick={()=>setReview(false)}>กลับไปแก้ข้อมูล</Btn></div></section>}
 {draft&&!review&&<section className="mt-10 space-y-4 border-t border-border pt-6"><h2 className="text-xl font-semibold">ร่างของคุณ</h2><label className="block">หัวเรื่อง<input className={field} maxLength={120} value={draft.title} onChange={e=>{setDraft({...draft,title:e.target.value});setCopied(false);}}/></label><label className="block">เรื่องราว<textarea className={field} rows={8} maxLength={2500} value={draft.story} onChange={e=>{setDraft({...draft,story:e.target.value});setCopied(false);}}/></label><p className="text-sm text-muted-foreground">AI อาจร่างคลาดเคลื่อน ตรวจยอด ข้อเท็จจริง และความเป็นส่วนตัวก่อนนำไปใช้ ไม่มีการยืนยันบิลหรือเผยแพร่อัตโนมัติ</p><Btn variant="outline" disabled={!draft.story.trim()||hasPrivateIdentifiers(draft.title+' '+draft.story)} onClick={async()=>{try{await navigator.clipboard.writeText(draft.title+'\n\n'+draft.story);setCopied(true);}catch{setError('คัดลอกไม่ได้ กรุณาเลือกข้อความแล้วคัดลอกเอง');}}}><Copy size={18}/>{copied?'คัดลอกแล้ว':'คัดลอกข้อความ'}</Btn></section>}
 {error&&<p role="alert" className="mt-5 text-destructive">{error}</p>}</>}
 </div></KlShell>;
}
