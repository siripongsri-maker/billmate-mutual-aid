import type { ShareCount } from './share-links';

// Link codes identify a public channel/destination, never a visitor. No attribution cookies/storage.
export function sendShareEvent(code:string,event:ShareCount['event']) {
  if(navigator.doNotTrack==='1' || (navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl)return;
  void fetch('/api/public/share-event',{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,event}),keepalive:true}).catch(()=>{});
}