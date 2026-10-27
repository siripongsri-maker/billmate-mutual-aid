// Only broad categories leave the browser. No cookies, IDs, raw URLs or form contents.
export function normalizePage(path) {
  const clean = path.split('?')[0];
  if (['/', '/konlanid/index.html'].includes(clean)) return 'home';
  if (['/bills','/browse'].includes(clean)) return 'browse';
  if (/^\/(bill\/[^/]+|bills\/[^/]+)$/.test(clean)) return 'bill';
  if (/^\/(help\/[^/]+|pay\/[^/]+|bills\/[^/]+\/contribute)$/.test(clean)) return 'help';
  if (/^\/thanks\/[^/]+$/.test(clean)) return 'thanks';
  return ({'/activity':'impact','/impact':'impact','/circles':'circles','/how-it-works':'trust','/corporate':'corporate','/onboarding':'onboarding'})[clean] ?? null;
}
export function classifySource(referrer, currentOrigin) {
  if (!referrer) return 'direct';
  try {
    const url = new URL(referrer);
    if (url.origin === currentOrigin) return 'direct';
    const host = url.hostname.toLowerCase();
    if (/^(www\.)?google\.(com|co\.th)$/.test(host)) return 'google';
    for (const [domain, source] of [['bing.com','bing'],['facebook.com','facebook'],['fb.com','facebook'],['instagram.com','instagram'],['line.me','line'],['tiktok.com','tiktok']]) {
      if (host === domain || host.endsWith('.'+domain)) return source;
    }
  } catch { /* No raw values are sent. */ }
  return 'other';
}
export function startTracking() {
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  const source = classifySource(document.referrer, location.origin);
  let last = '', visited = false, sent = 0;
  const send = (event, page) => {
    if (!page || sent >= 100) return;
    sent++;
    void fetch('/api/public/traffic', { method:'POST', credentials:'omit', headers:{'Content-Type':'application/json'}, body:JSON.stringify({event,page,source}), keepalive:true }).catch(() => {});
  };
  const update = () => {
    const path = location.pathname === '/konlanid/index.html' ? (location.hash.slice(1) || '/') : location.pathname;
    if (path === last) return;
    last = path;
    const page = normalizePage(path);
    if (!page) return;
    if (!visited) { send('visit',page); visited = true; }
    send('page_view',page);
    if (page === 'bill') send('bill_view',page);
  };
  window.addEventListener('hashchange',update);
  window.addEventListener('traffic-route',update);
  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target.closest('button,a') : null;
    if (target?.matches('[data-start-help]') || (target instanceof HTMLAnchorElement && /^\/bills\/[^/]+\/contribute$/.test(new URL(target.href).pathname))) send('help_click','bill');
  });
  update();
}
if (typeof window !== 'undefined') startTracking();