'use strict';

(() => {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    bills: '<path d="M6 2h9l4 4v16l-3-2-4 2-4-2-3 2V3a1 1 0 0 1 1-1Z"/><path d="M14 2v5h5M8 11h7m-7 4h5"/>',
    heart: '<path d="M20.5 4.8a5.2 5.2 0 0 0-7.4 0L12 5.9l-1.1-1.1a5.2 5.2 0 0 0-7.4 7.4L12 21l8.5-8.8a5.2 5.2 0 0 0 0-7.4Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
    bell: '<path d="M5 9a7 7 0 0 1 14 0v6l2 3H3l2-3V9Z"/><path d="M9 21h6"/>',
    shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
    check: '<path d="m6 12 4 4 8-9"/><circle cx="12" cy="12" r="10"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    flag: '<path d="M4 22V3m0 1c5-4 10 4 16 0v11c-6 4-11-4-16 0"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
    leaf: '<path d="M20 3C9 1 2 7 5 15s16 8 15-12Z"/><path d="M3 22 16 8M8 16l-1-6m5 2h5"/>',
    settings: '<path d="m10 2-.8 3-2.6 1.5-3-.8-2 3.5 2.3 2.2v3L1.6 17l2 3.4 3-.8 2.6 1.5.8 3h4l.8-3 2.6-1.5 3 .8 2-3.4-2.3-2.3v-3L22.4 9l-2-3.4-3 .8L14.8 5 14 2Z" transform="translate(0 -1) scale(.95)"/><circle cx="12" cy="12" r="3"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    drop: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/><path d="M9 17a3 3 0 0 0 3 2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
    car: '<path d="m5 6-2 6v7h3v-3h12v3h3v-7l-2-6H5Z"/><path d="M3 12h18M7 6l1-3h8l1 3M6 14h2m8 0h2"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4m4 0h3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.1"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    return: '<path d="m8 3-5 5 5 5M3 8h11a7 7 0 0 1 0 14h-3"/>'
  };
  const icon = (name, extra = '') => `<svg class="${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  const money = n => `฿${n.toLocaleString('en-US')}`;
  const safe = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const initialBills = [
    {
      id:'electricity', label:'ค่าไฟ', icon:'bolt', title:'ค่าไฟฟ้าประจำเดือน',
      alias:'เพื่อนบ้านผู้ดูแลครอบครัว', region:'กรุงเทพมหานคร',
      story:'เดือนนี้รายได้ของครอบครัวสะดุด จึงอยากขอแรงช่วยแบ่งเบาค่าไฟรอบนี้ เพื่อให้จัดการค่าใช้จ่ายจำเป็นอื่น ๆ ต่อได้',
      goal:1600, raised:1280, helpers:56, due:'30 ต.ค. 2569', days:2,
      cutoff:'28 ต.ค. 2569 · 12:00 น.', round:'ตุลาคม 2569',
      provider:'ผู้ให้บริการไฟฟ้า (ตัวอย่าง)', account:'***–0142',
      scope:'ค่าไฟรอบตุลาคม หนึ่งบิล', condition:'รวบรวมให้ครบ ฿1,600 ก่อนจ่ายตรงผู้รับบิล',
      after:'หลังผู้รับชำระยืนยัน บิลรอบนี้คงเหลือ ฿0', conditional:false
    },
    {
      id:'water', label:'ค่าน้ำ', icon:'drop', title:'ค่าน้ำใช้ในบ้านเดือนนี้',
      alias:'เพื่อนบ้านผู้เช่าห้อง', region:'ภาคกลาง',
      story:'ผู้เช่าขอแบ่งเบาค่าน้ำรอบนี้ โดยในเคสตัวอย่างได้ตรวจสิทธิใช้งานและความยินยอมของเจ้าของบัญชีแล้ว',
      goal:640, raised:420, helpers:12, due:'31 ต.ค. 2569', days:3,
      cutoff:'28 ต.ค. 2569 · 12:00 น.', round:'ตุลาคม 2569',
      provider:'ผู้ให้บริการน้ำ (ตัวอย่าง)', account:'***–0275',
      scope:'ค่าน้ำรอบตุลาคม หนึ่งบิล', condition:'รวบรวมให้ครบ ฿640 ก่อนจ่ายตรงผู้รับบิล',
      after:'หลังผู้รับชำระยืนยัน บิลรอบนี้คงเหลือ ฿0', conditional:false
    },
    {
      id:'car', label:'ค่างวดรถ', icon:'car', title:'แบ่งเบาหนึ่งงวด ให้ไปทำงานต่อ',
      alias:'เพื่อนที่ใช้รถทำงาน', region:'ภาคตะวันออก',
      story:'ขอความช่วยเหลือเฉพาะงวดที่ระบุ เพื่อประคองภาระในช่วงรายได้ติดขัด โดยต้องตรวจความเกี่ยวข้องกับสัญญาและเงื่อนไขเจ้าหนี้ก่อนเปิดรับช่วย',
      goal:4200, raised:2480, helpers:38, due:'2 พ.ย. 2569', days:5,
      cutoff:'29 ต.ค. 2569 · 12:00 น.', round:'งวดที่ 18 · ตุลาคม 2569',
      provider:'ผู้ให้สินเชื่อรถ (ตัวอย่าง)', account:'***–0368',
      scope:'งวดที่ 18 จำนวน ฿4,200 เท่านั้น', condition:'เคสตัวอย่างที่เจ้าหนี้ยืนยันรับชำระงวดนี้เต็มยอดได้',
      after:'ยังมีหนี้ตามสัญญางวดถัดไป ไม่ได้ปิดสัญญา', conditional:true
    },
    {
      id:'credit', label:'บัตรเครดิต', icon:'card', title:'แบ่งเบาภาระบัตรในเดือนที่ติดขัด',
      alias:'เพื่อนผู้ถือบัตร', region:'ภาคเหนือ',
      story:'ขอช่วยเฉพาะยอดที่กำหนดในรอบนี้ ทีมงานต้องประเมินความจำเป็นแยกจากการตรวจว่าใบแจ้งยอดเป็นของจริง และไม่เปิดรายการใช้จ่ายส่วนตัวต่อสาธารณะ',
      goal:1500, raised:900, helpers:18, due:'3 พ.ย. 2569', days:6,
      cutoff:'29 ต.ค. 2569 · 12:00 น.', round:'รอบบัญชีตุลาคม 2569',
      provider:'ผู้ออกบัตรเครดิต (ตัวอย่าง)', account:'***–0449',
      scope:'ช่วย ฿1,500 จากใบแจ้งยอด ฿12,500', condition:'เคสตัวอย่างที่ผู้ออกบัตรยืนยันรับชำระ ฿1,500 ได้',
      after:'หนี้คงเหลือ ฿11,000 ก่อนดอกเบี้ยและค่าธรรมเนียมเพิ่มเติม', conditional:true
    }
  ];
  const state = {
    bills: initialBills.map(b => ({...b})), contributions:[], requests:[], favorites:new Set(), paused:new Set(),
    drafts:{}, filter:'all', search:'', proofStage:0, requestStep:0,
    requestDraft:{type:'electricity', relation:'self'}, lastReceipt:null, notifications:[], anonymous:true
  };
  const app = document.querySelector('#app');
  const dialog = document.querySelector('#support-dialog');
  const support = document.querySelector('#support-content');
  const scrollPositions = new Map();
  let currentHash = '', lastFocus = null, processing = false, toastTimer;
  const getBill = id => state.bills.find(b => b.id === id);
  const missing = b => Math.max(0, b.goal - b.raised);
  const route = () => (location.hash.slice(1) || '/').split('?')[0];

  function hydrateIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {el.innerHTML = icon(el.dataset.icon);});
  }
  function toast(message) {
    const el = document.querySelector('#toast');
    if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }
  function go(path) {
    if (route() === path) {render(); return;}
    location.hash = path;
  }
  function topbar(title, {back = false, intro = '', action = ''} = {}) {
    return `<header class="view-header"><div>${back ? `<a class="back-link" href="${back}">${icon('back')}<span>ย้อนกลับ</span></a>` : ''}${intro ? `<p class="eyebrow">${intro}</p>` : ''}<h1 class="view-title" tabindex="-1">${title}</h1></div>${action}</header>`;
  }
  function backButton(href, label = 'ย้อนกลับ') {
    return `<a class="back-link" href="${href}">${icon('back')}<span>${label}</span></a>`;
  }
  function statusPill(b) {
    if (state.paused.has(b.id)) return `<span class="status-pill paused">${icon('flag')}พักตรวจสอบ</span>`;
    if (!missing(b)) return `<span class="status-pill pending">${icon('clock')}ครบเป้า · รอจ่าย</span>`;
    return `<span class="status-pill verified">${icon('check')}${b.conditional ? 'ตรวจเงื่อนไขเฉพาะ (สมมติ)' : 'ตรวจข้อมูลแล้ว (สมมติ)'}</span>`;
  }
  function progress(b) {
    return `<div class="progress" role="progressbar" aria-label="ยอดรวบรวมสำหรับ${b.label}" aria-valuemin="0" aria-valuemax="${b.goal}" aria-valuenow="${b.raised}"><span style="transform:scaleX(${Math.min(1,b.raised/b.goal)})"></span></div>`;
  }
  function billCard(b, compact = false) {
    const gap = missing(b);
    return `<article class="bill-card${compact ? ' compact' : ''}">
      <div class="bill-card-top"><span class="category-icon ${b.id}">${icon(b.icon)}</span><div class="bill-card-heading"><a href="#/bill/${b.id}" class="bill-card-title">${b.title}</a><p class="bill-meta">โดย ${b.alias}<br>${b.region} · นามสมมติ</p></div><button class="icon-button bill-save${state.favorites.has(b.id) ? ' is-saved' : ''}" data-save="${b.id}" aria-pressed="${state.favorites.has(b.id)}" aria-label="${state.favorites.has(b.id) ? 'ยกเลิกเก็บ' : 'เก็บ'}${b.title}">${icon('heart')}</button></div>
      <div class="bill-stats"><div><span class="amount-main">${money(gap)}</span><span class="amount-target"> / ${money(b.goal)}</span><p class="bill-meta">ยอดที่ยังขาด / เป้าหมายบิล</p></div><span class="bill-meta">${state.paused.has(b.id) ? 'พักรับยอดเพิ่ม' : gap ? `ปิดรับใน ${b.days} วัน` : 'ปิดรับแล้ว'}</span></div>
      ${progress(b)}
      <div class="bill-card-bottom"><div><p class="bill-meta">ช่วยแล้ว <b>${money(b.raised)}</b> (${b.helpers} คน)</p>${statusPill(b)}</div><a class="button coral bill-card-action" href="#/bill/${b.id}">${state.paused.has(b.id) ? 'ดูสถานะ' : gap ? 'ช่วยอีกนิด' : 'ดูบิล'} ${icon('arrow')}</a></div>
    </article>`;
  }
  function home() {
    return `<section class="view home-view"><header class="view-header home-header"><div class="mobile-brand"><span class="mini-brand-mark">นิด<span>.</span></span><span class="mobile-brand-name">คนละนิด</span></div><button class="icon-button" data-notifications aria-label="การแจ้งเตือน">${icon('bell')}${state.notifications.length ? '<span class="notification-dot"></span>' : ''}</button></header>
      <div class="home-layout"><div class="home-hero"><p class="eyebrow">A LITTLE FROM EACH OF US.</p><h1 class="view-title home-title" tabindex="-1">วันนี้<br>ช่วยกันคนละนิดไหม?</h1><p class="home-description">ไม่ต้องมีมาก แค่ช่วยกันคนละนิด<br>ก็แบ่งเบาบิลของใครอีกคนได้</p><img class="home-art" src="assets/helping-hand.webp" width="720" height="480" alt="ภาพวาดมือประคองหัวใจ สื่อถึงการแบ่งปัน" fetchpriority="high"><a class="button primary hero-cta" href="#/bills">ช่วยจ่ายคนละนิด ${icon('arrow')}</a>
      <div class="quick-actions"><a class="quick-action" href="#/request"><span class="quick-icon yellow">${icon('file')}</span><span>ขอให้ช่วย<br>แบ่งเบาบิล</span></a><a class="quick-action" href="#/activity"><span class="quick-icon pink">${icon('heart')}</span><span>ตามดู<br>รอยต่อการช่วย</span></a><button class="quick-action" data-help><span class="quick-icon mint">${icon('shield')}</span><span>ดูแล<br>ความไว้ใจ</span></button></div></div>
      <div class="home-bills"><div class="section-label"><div><p class="eyebrow">SMALL HELP. REAL DIRECTION.</p><h2>บิลเล็ก ๆ ที่รอเรา</h2></div><a class="text-link" href="#/bills">ดูทั้งหมด ${icon('chevron')}</a></div><div class="bill-list">${billCard(state.bills[0], true)}${billCard(state.bills[1], true)}</div><div class="support-note">${icon('lock')}<p><b>มีปลายทางให้ติดตาม</b><br>รวมยอดแล้วจ่ายตรงผู้รับบิลที่ตรวจไว้<br>ติดตามจนผู้รับชำระยืนยันผล</p></div><p class="small-text demo-caption">เคส ยอด และผลการตรวจทั้งหมดเป็นข้อมูลสมมติ</p></div></div>
      <div class="value-banner"><span class="value-symbol">${icon('leaf')}</span><div><h2>คนละนิด ไม่ใช่จำนวนเงิน</h2><p>แต่คือสิ่งที่เราทำให้กันได้ · ให้เท่าที่ไหว ไม่มีภาระต้องตอบแทน</p></div></div>
    </section>`;
  }
  function browse() {
    return `<section class="view browse-view">${topbar('บิลที่รอเรา', {intro:'คนละนิด ช่วยให้ชีวิตไปต่อ',action:`<a class="icon-button" href="#/request" aria-label="ส่งคำขอช่วยจ่ายบิล">${icon('plus')}</a>`})}<div class="browse-toolbar"><label class="search-field" for="bill-search">${icon('search')}<input class="input" id="bill-search" type="search" placeholder="ค้นหาบิล เช่น ค่าไฟ ค่าน้ำ ค่างวดรถ" value="${safe(state.search)}" autocomplete="off" aria-label="ค้นหาบิล"></label><div class="filters" role="group" aria-label="ประเภทบิล">${[{id:'all',label:'ทั้งหมด'},...state.bills].map(b=>`<button class="filter${state.filter===b.id?' active':''}" data-filter="${b.id}" aria-pressed="${state.filter===b.id}">${b.label}</button>`).join('')}</div></div><p class="small-text list-context">ช่วยเท่าที่ไหว เริ่มที่ ฿20 · แสดงเคสสมมติ</p><div id="bills-results" class="bill-list browse-list" aria-live="polite">${browseCards()}</div></section>`;
  }
  function browseCards() {
    const search=state.search.trim().toLocaleLowerCase('th');
    const shown=state.bills.filter(b=>(state.filter==='all'||state.filter===b.id)&&(!search||`${b.title} ${b.label} ${b.alias} ${b.region}`.toLocaleLowerCase('th').includes(search)));
    return shown.length ? shown.map(b=>billCard(b)).join('') : `<div class="empty-state">${icon('search')}<h2>ยังไม่พบบิลที่ค้นหา</h2><p>ลองใช้คำสั้น ๆ หรือเลือกดูทุกประเภท</p><button class="button soft" data-clear-search>ดูบิลทั้งหมด</button></div>`;
  }
  function documentPreview(b, small = false) {
    return `<div class="document-preview${small?' small-document':''}" aria-label="ใบแจ้งยอดสมมติที่ปิดบังข้อมูลแล้ว"><div class="document-heading"><span>${icon(b.icon)} ใบแจ้งยอด${b.label}</span><span class="document-sample">SAMPLE</span></div><div class="document-lines"><p>ชื่อเจ้าของบัญชี <span class="redacted" aria-label="ปิดบังแล้ว"></span></p><p>ที่อยู่ <span class="redacted long" aria-label="ปิดบังแล้ว"></span></p><p>เลขอ้างอิง <b>${b.account}</b></p><p>รอบบิล <b>${b.round}</b></p></div><div class="document-amount"><span>${b.id==='credit'?'ยอดตามใบแจ้ง':'ยอดตามบิล'}</span><b>${b.id==='credit'?'฿12,500':money(b.goal)}</b></div><p class="small-text">ภาพเอกสารประกอบแนวคิด ไม่มีข้อมูลบุคคลจริง</p></div>`;
  }
  function checks() {
    return `<div class="trust-checks"><div class="trust-item">${icon('user')}<div><b>ตรวจผู้ขอและสิทธิต่อบิล</b><span>ยืนยันแบบส่วนตัว ไม่เปิดเอกสารตัวตน</span></div>${icon('check')}</div><div class="trust-item">${icon('file')}<div><b>ตรวจยอดกับต้นทาง</b><span>ตรวจรอบบิล เลขอ้างอิง และบิลซ้ำ</span></div>${icon('check')}</div><div class="trust-item">${icon('shield')}<div><b>ตรวจเงื่อนไขผู้รับชำระ</b><span>ล็อกผู้รับเงินและวิธีจ่ายของบิลนี้</span></div>${icon('check')}</div></div><p class="small-text">สถานะการตรวจสมมติ ณ 26 ต.ค. 2569 · บิลจริงไม่ได้พิสูจน์ความเดือดร้อนทั้งหมด</p>`;
  }
  function detail(b) {
    const gap=missing(b), paused=state.paused.has(b.id);
    return `<section class="view detail-view"><div class="view-header">${backButton('#/bills','บิลที่รอเรา')}<div class="header-actions"><button class="icon-button${state.favorites.has(b.id)?' is-saved':''}" data-save="${b.id}" aria-pressed="${state.favorites.has(b.id)}" aria-label="${state.favorites.has(b.id)?'ยกเลิกเก็บ':'เก็บ'}บิลนี้">${icon('heart')}</button><button class="icon-button" data-report="${b.id}" aria-label="รายงานบิลนี้">${icon('flag')}</button></div></div><div class="detail-layout"><div class="detail-main">${documentPreview(b)}<div class="detail-title"><span class="category-label">${b.label}</span><h1 class="view-title" tabindex="-1">${b.title}</h1><p class="bill-meta">โดย ${b.alias} · นามสมมติ</p><p class="bill-meta">${icon('pin')} ${b.region}</p></div><section class="story-section"><h2>เรื่องราวของบิลนี้</h2><p>${b.story}</p><p class="small-text">ผู้ขอไม่จำเป็นต้องเปิดหน้า เล่าเรื่องส่วนตัว หรือโพสต์ขอบคุณเพื่อได้รับความช่วยเหลือ</p></section><section class="verification-section"><div class="section-label"><h2>ดูแลความไว้ใจอย่างไร</h2><span class="demo-pill">สถานะสมมติ</span></div>${checks()}<button class="text-link" data-help>อ่านขอบเขตการตรวจ ${icon('chevron')}</button></section></div><aside class="detail-aside"><div class="form-card"><div class="section-label">${statusPill(b)}<span class="small-text">${paused ? 'พักรับยอดเพิ่ม' : gap ? `ปิดรับใน ${b.days} วัน` : 'ปิดรับแล้ว'}</span></div><div class="detail-balance"><span class="amount-main">${money(gap)}</span><span class="amount-target"> / ${money(b.goal)}</span><p class="bill-meta">ยอดที่ยังขาด / เป้าหมายบิล</p></div>${progress(b)}<p class="bill-meta">ช่วยแล้ว <b>${money(b.raised)}</b> จาก ${b.helpers} แรงช่วย</p><div class="summary-box"><div class="summary-row"><span>ผู้รับชำระ</span><b>${b.provider}</b></div><div class="summary-row"><span>บัญชีที่ปิดบัง</span><b>${b.account}</b></div><div class="summary-row"><span>ช่วยเฉพาะ</span><b>${b.scope}</b></div><div class="summary-row"><span>ปิดรับยอดช่วย</span><b>${b.cutoff}</b></div><div class="summary-row"><span>กำหนดตามบิล</span><b>${b.due}</b></div></div>${b.conditional?`<div class="support-note warm">${icon('info')}<p><b>เงื่อนไขเฉพาะรายเจ้าหนี้</b><br>${b.condition}<br>${b.after}</p></div>`:''}${paused?`<div class="support-note warning">${icon('flag')}<p><b>พักการรับยอดช่วย</b><br>รอผู้ตรวจทบทวนรายงาน ยังช่วยจ่ายเพิ่มไม่ได้</p></div><button class="button outline full" data-report-status="${b.id}">ดูสถานะการทบทวน</button>`:gap?`<button class="button coral full" data-start-help="${b.id}">ช่วยอีกนิด เริ่ม ฿20 ${icon('arrow')}</button>`:`<div class="support-note">${icon('clock')}<p><b>ครบเป้าหมายแล้ว</b><br>หยุดรับเพิ่ม และรอตรวจยอดก่อนส่งชำระ</p></div><a class="button outline full" href="#/activity">ดูเส้นทางการชำระ</a>`}<p class="small-text centered">รับยอดช่วยแล้ว ≠ จ่ายบิลแล้ว</p></div><div class="support-note">${icon('lock')}<p>จ่ายตรงผู้รับบิลที่ตรวจแล้ว<br>ไม่โอนเข้าบัญชีส่วนตัวผู้ขอ</p></div></aside></div><div class="mobile-helpbar"><div><small>ยอดที่ยังขาด</small><b>${money(gap)}</b></div>${paused ? `<span class="status-pill paused">พักตรวจสอบ</span>` : gap ? `<button class="button coral" data-start-help="${b.id}">ช่วยอีกนิด ${icon('heart')}</button>` : `<a class="button outline" href="#/activity">ติดตามสถานะ</a>`}</div></section>`;
  }
  function getDraft(b, fresh = false) {
    if (fresh || !state.drafts[b.id]) state.drafts[b.id] = {amount:Math.min(20,missing(b)), anonymous:true, message:'กำลังใจเล็ก ๆ ให้กัน', consumed:false};
    return state.drafts[b.id];
  }
  function amountError(b, value) {
    const gap=missing(b), min=Math.min(20,gap);
    if (!Number.isFinite(value)||!Number.isInteger(value)) return 'กรอกจำนวนเงินบาทเต็มจำนวน';
    if (value<min) return `เริ่มที่ ${money(min)} เลือกตามกำลังที่สะดวกได้`;
    if (value>gap) return `ยอดที่ยังขาดคือ ${money(gap)} กรุณาช่วยไม่เกินยอดนี้`;
    return '';
  }
  function helpSummary(b) {
    return `<div class="help-summary"><span class="category-icon ${b.id}">${icon(b.icon)}</span><h2>${b.title}</h2><p class="bill-meta">โดย ${b.alias} · นามสมมติ</p><div class="summary-box"><div class="summary-row"><span>ยังขาด</span><b>${money(missing(b))}</b></div><div class="summary-row"><span>ผู้รับชำระที่ล็อกไว้</span><b>${b.provider} ${icon('lock')}</b></div><div class="summary-row"><span>บัญชี</span><b>${b.account}</b></div><div class="summary-row"><span>ช่วยเฉพาะ</span><b>${b.scope}</b></div><div class="summary-row"><span>ปิดรับยอดช่วย</span><b>${b.cutoff}</b></div></div><p class="small-text">${b.condition}</p>${b.conditional?`<div class="support-note warm">${icon('info')}<p>${b.after}</p></div>`:''}</div>`;
  }
  function help(b, error = '') {
    if (state.paused.has(b.id) || !missing(b)) return unavailableHelp(b);
    const draft=getDraft(b);
    if (draft.consumed) return `<section class="view">${topbar('รายการนี้รับยอดช่วยแล้ว',{back:`#/bill/${b.id}`})}<div class="empty-state">${icon('check')}<p>เราไม่เพิ่มยอดซ้ำเมื่อย้อนกลับมาหน้านี้</p><a class="button primary" href="#/received/${b.id}">ดูรายการของคุณ</a><button class="button outline" data-start-help="${b.id}">เริ่มช่วยใหม่อีกครั้ง</button></div></section>`;
    return `<section class="view help-view">${topbar('ช่วยจ่ายคนละนิด',{back:`#/bill/${b.id}`,intro:'01 / เลือกยอดที่สบายใจ'})}<div class="help-layout">${helpSummary(b)}<div class="help-form form-card"><h2>วันนี้อยากช่วยเท่าไร</h2><p class="muted">เงินเล็ก ๆ หลายคน ก็แบ่งเบาบิลหนึ่งใบได้</p><form id="help-form" data-bill="${b.id}" novalidate><div class="amount-options" role="group" aria-label="เลือกจำนวนช่วย">${[20,50,100].map(n=>`<button class="amount-option${draft.amount===n?' selected':''}" type="button" data-amount="${n}" ${n>missing(b)?'disabled':''} aria-pressed="${draft.amount===n}">${money(n)}</button>`).join('')}</div><div class="form-field"><label class="field-label" for="custom-amount">หรือระบุจำนวนเอง</label><div class="amount-input"><input class="input" id="custom-amount" name="amount" type="number" inputmode="numeric" min="${Math.min(20,missing(b))}" max="${missing(b)}" step="1" value="${draft.amount}" required autocomplete="off" aria-describedby="amount-hint amount-error" ${error?'aria-invalid="true"':''}><span aria-hidden="true">฿</span></div><p id="amount-hint" class="small-text">จำนวนเต็ม เริ่ม ${money(Math.min(20,missing(b)))} · ไม่เกินยอดที่ขาด ${money(missing(b))}</p><p id="amount-error" class="field-error" role="alert">${error}</p></div><div class="form-field"><label class="field-label" for="encouragement">ส่งกำลังใจให้กัน <span class="muted">(ไม่บังคับ)</span></label><select class="input" id="encouragement" name="message"><option value="">ไม่ส่งข้อความ</option>${['กำลังใจเล็ก ๆ ให้กัน','ขอให้เดือนนี้เบาลงอีกนิด','วันนี้เราอยู่ข้างกันนะ'].map(t=>`<option${draft.message===t?' selected':''}>${t}</option>`).join('')}</select></div><label class="checkbox-label"><input type="checkbox" id="anonymous" ${draft.anonymous?'checked':''}> ไม่แสดงชื่อผู้ช่วย</label><button type="submit" class="button coral full">ทบทวนก่อนช่วย ${icon('arrow')}</button><p class="small-text centered">ให้ครั้งเดียว ไม่มีค่าทิปหรือการหักเงินต่อเนื่อง</p></form><div class="support-note">${icon('lock')}<p>ต้นแบบนี้ไม่รับเงินจริง<br>ขั้นต่อไปให้ตรวจปลายทางและเงื่อนไขก่อนยืนยัน</p></div></div></div></section>`;
  }
  function unavailableHelp(b) {
    return `<section class="view">${topbar('ยังช่วยเพิ่มไม่ได้',{back:`#/bill/${b.id}`})}<div class="empty-state">${icon(state.paused.has(b.id)?'flag':'clock')}<h2>${state.paused.has(b.id)?'บิลนี้พักรับยอดช่วย':'บิลนี้ครบเป้าหมายแล้ว'}</h2><p>${state.paused.has(b.id)?'รอผู้ตรวจทบทวนรายงานก่อนเปิดรับใหม่':'กำลังรอตรวจยอดล่าสุดและส่งชำระ ยังไม่ได้หมายความว่าจ่ายบิลแล้ว'}</p><a class="button primary" href="#/bill/${b.id}">กลับไปดูสถานะบิล</a></div></section>`;
  }
  function review(b) {
    if (state.paused.has(b.id) || !missing(b)) return unavailableHelp(b);
    const d=getDraft(b);
    if(d.consumed) return help(b);
    const error=amountError(b, d.amount);
    if(error) return help(b,error);
    return `<section class="view review-view">${topbar('เห็นปลายทาง ก่อนช่วย',{back:`#/help/${b.id}`,intro:'02 / ทบทวนรายการ'})}<div class="help-layout">${helpSummary(b)}<div class="help-form form-card"><p class="step-label">อีกนิดเดียว ก่อนส่งแรงช่วย</p><h2>คุณกำลังช่วย ${money(d.amount)}</h2><div class="summary-box"><div class="summary-row"><span>ยอดที่คุณช่วย</span><b>${money(d.amount)}</b></div><div class="summary-row"><span>ค่าธรรมเนียม</span><b>฿0 <small>(สมมติ)</small></b></div><div class="summary-row total"><span>ยอดรวมตัวอย่าง</span><b>${money(d.amount)}</b></div><div class="summary-row"><span>ชื่อผู้ช่วย</span><b>${d.anonymous?'ไม่แสดงชื่อ':'เพื่อนคนละนิด · ชื่อตัวอย่าง'}</b></div>${d.message?`<div class="summary-row"><span>กำลังใจ</span><b>${safe(d.message)}</b></div>`:''}</div><div class="support-note warm">${icon('clock')}<p><b>${b.condition}</b><br>หากไม่ครบเมื่อปิดรับ ให้หยุดเคสและคืนผ่านช่องทางเดิมตามเงื่อนไขที่แจ้ง ไม่ย้ายยอดไปบิลอื่นเอง</p></div><ul class="review-checks"><li>${icon('check')} ผู้ขอไม่ต้องคืนเงินให้ผู้ช่วย</li><li>${icon('check')} ยังไม่ถือว่าบิลถูกจ่ายทันทีที่รับยอดช่วย</li><li>${icon('check')} ไม่มีการหักซ้ำหรือค่าทิป</li></ul><button class="button coral full" id="confirm-help" data-confirm="${b.id}">จำลองช่วย ${money(d.amount)} ${icon('heart')}</button><p class="small-text centered">ไม่มีการตัดเงินจริง และไม่ใช่ใบเสร็จรับเงิน</p><details class="faq"><summary>สิ่งที่ต้องแจ้งก่อนใช้เงินจริง ${icon('chevron')}</summary><p>บริการจริงต้องตกลงช่องทางรับเงิน การรวมยอด ค่าธรรมเนียม เวลาจ่าย เวลาคืนเงิน และกรณีเรียกคืนภายหลังกับพาร์ทเนอร์ก่อนเปิดใช้ การรวมยอดไม่รับประกันว่าจะจ่ายทันวันครบกำหนด</p></details></div></div></section>`;
  }
  function received(b) {
    const receipt=[...state.contributions].reverse().find(c=>c.billId===b.id);
    if(!receipt) return `<section class="view">${topbar('ยังไม่มีรายการของบิลนี้',{back:`#/bill/${b.id}`})}<div class="empty-state">${icon('heart')}<p>เลือกจำนวนที่สบายใจก่อนเริ่มช่วยกัน</p><button class="button primary" data-start-help="${b.id}">ลองช่วยเริ่ม ฿20</button></div></section>`;
    return `<section class="view success-view"><div class="view-header">${backButton('#/bills','บิลที่รอเรา')}<span class="demo-pill">DEMO</span></div><div class="success-layout"><div class="success-content"><div class="success-check">${icon('check')}</div><p class="eyebrow">ขอบคุณที่ส่งแรงช่วย</p><h1 class="view-title success-title" tabindex="-1">ขอบคุณที่ช่วย<br>คนละนิดนะคะ</h1><p class="success-description">รับยอดช่วยตัวอย่าง ${money(receipt.amount)} แล้ว<br>อีกแรงเล็ก ๆ ของคุณ มีความหมายเสมอ</p><div class="receipt-card mini-receipt"><div class="summary-row"><span>${b.label} · ${b.account}</span><b>${money(receipt.amount)}</b></div><div class="summary-row"><span>สถานะบิล</span><b>${missing(b)?'กำลังรวบรวมยอด':'ครบเป้าหมาย · รอส่งชำระ'}</b></div><p class="small-text">บิลยังไม่ได้รับการชำระ ไม่มีเงินจริงถูกส่งในต้นแบบนี้</p></div><a class="button outline full" href="#/activity">ดูความคืบหน้าการช่วยของคุณ ${icon('arrow')}</a><a class="back-home" href="#/">กลับหน้าหลัก</a></div><img class="success-art" src="assets/woman-heart.webp" width="650" height="650" alt="ภาพวาดผู้หญิงกอดหัวใจด้วยรอยยิ้ม"></div></section>`;
  }
  function timeline(b, stage=0, demo=false) {
    const items=[
      ['รับยอดช่วยแล้ว',`รวบรวม ${money(b.raised)} / ${money(b.goal)} · ยังไม่จ่ายบิล`],
      ['ส่งชำระแล้ว · รอยืนยัน','ต้องตรวจยอดและคำสั่งจ่ายก่อนส่งถึงผู้รับบิล'],
      ['ผู้รับชำระยืนยันแล้ว',b.id==='credit'?'แสดงยอดที่ลดลงและหนี้ที่ยังเหลือ':'แสดงผลจากต้นทางและยอดค้างรอบบิลล่าสุด']
    ];
    return `<ol class="timeline">${items.map(([title,desc],i)=>`<li class="timeline-item${i<=stage?' done':''}"><span class="timeline-dot">${i<stage?icon('check'):i+1}</span><div><b>${title}</b><p>${desc}</p></div></li>`).join('')}</ol>${!demo?'<p class="small-text">ขั้นที่ยังไม่เสร็จเป็นเส้นทางที่ต้องติดตาม ไม่ใช่ผลชำระที่เกิดขึ้นแล้ว</p>':''}`;
  }
  function demoProof() {
    const stage=state.proofStage;
    const labels=['รวบรวมยอด','ส่งชำระแล้ว','ผู้รับชำระยืนยัน'];
    const proof=[
      {title:'กำลังรวบรวม ยังไม่จ่ายบิล',status:'กำลังรวบรวม',kind:'pending',amount:420,amountLabel:'ยอดรวบรวม',left:'฿640 · ยังไม่ได้ชำระ',note:'ยังไม่มีหลักฐานการชำระ บิลนี้ต้องรวบรวมให้ครบ ฿640 ก่อนจ่าย',ref:'DEMO-W026 / COLLECTING'},
      {title:'ส่งชำระแล้ว · รอยืนยัน',status:'รอผลจากผู้รับชำระ',kind:'pending',amount:640,amountLabel:'ยอดส่งชำระ',left:'รอยืนยันยอดล่าสุด',note:'เลขรายการจากพาร์ทเนอร์ยังไม่ใช่ผลยืนยันจากผู้รับบิล หากสถานะไม่ชัดให้ตรวจสอบก่อนส่งซ้ำ',ref:'DEMO-W026 / TRANSACTION ***42'},
      {title:'บิลรอบนี้ได้รับการจ่ายแล้ว',status:'ผู้รับชำระยืนยันแล้ว',kind:'paid',amount:640,amountLabel:'ยอดที่ยืนยันรับแล้ว',left:'฿0 สำหรับบิลรอบนี้',note:'ตัวอย่างผลจากผู้รับชำระ: รับ ฿640 แล้ว ยอดค้างรอบนี้เป็นศูนย์ ไม่ใช่เพียงภาพสลิปของผู้ขอ',ref:'DEMO-W026 / CONFIRMATION ***42'}
    ][stage];
    return `<section class="demo-proof-section"><div class="section-label"><div><p class="eyebrow">ลองดูเส้นทางหลักฐาน</p><h2>เห็นว่าช่วยถึงไหน</h2></div><span class="demo-pill">จำลองสถานะ</span></div><p class="small-text">ตัวอย่างบิลค่าน้ำแยกจากรายการของคุณ · ทุกขั้นตอนเป็นข้อมูลสมมติ</p><div class="filters proof-filters" role="group" aria-label="จำลองสถานะหลักฐาน">${labels.map((text,i)=>`<button class="filter${stage===i?' active':''}" data-proof-stage="${i}" aria-pressed="${stage===i}">${i+1}. ${text}</button>`).join('')}</div><div id="demo-proof-receipt" class="receipt-card proof-receipt" aria-live="polite"><div class="receipt-brand"><span class="mini-brand-mark">นิด.</span><span class="demo-pill">DEMO ONLY</span></div><h3>${proof.title}</h3><span class="status-pill ${proof.kind}">${icon(stage===2?'check':'clock')}${proof.status}</span><div class="summary-box"><div class="summary-row"><span>ผู้รับชำระ</span><b>ผู้ให้บริการน้ำ (ตัวอย่าง)</b></div><div class="summary-row"><span>บัญชี / รอบบิล</span><b>***–0275 · ต.ค. 2569</b></div><div class="summary-row total"><span>${proof.amountLabel}</span><b>${money(proof.amount)}</b></div><div class="summary-row"><span>ยอดค้างในบิลรอบนี้</span><b>${proof.left}</b></div></div><p class="support-note">${icon('file')}<span>${proof.note}</span></p><p class="small-text receipt-reference">${proof.ref}<br>ไม่ใช่ใบเสร็จหรือหลักฐานชำเงินจริง</p></div></section>`;
  }
  function activity() {
    const total=state.contributions.reduce((n,c)=>n+c.amount,0);
    return `<section class="view activity-view">${topbar('รอยต่อการช่วย',{intro:'ทุกแรงช่วย มีปลายทางให้ติดตาม'})}<div class="activity-summary"><span class="category-icon water">${icon('leaf')}</span><div><p class="muted">คุณส่งแรงช่วยในรอบทดลองนี้</p><h2>${money(total)} <span class="small-text">จาก ${state.contributions.length} ครั้ง</span></h2></div></div><div class="activity-layout"><div class="activity-list">${state.contributions.length?[...state.contributions].reverse().map(c=>{const b=getBill(c.billId);return `<article class="activity-card"><div class="section-label"><div><span class="category-label">${b.label} · รายการ ${c.id}</span><h2>${b.title}</h2></div><b class="activity-amount">${money(c.amount)}</b></div><p class="small-text">รับยอดช่วยตัวอย่างแล้ว · ยังไม่ใช่การชำระบิล</p>${state.paused.has(b.id)?`<div class="support-note warning">${icon('flag')}<p>เคสพักรับยอดเพิ่ม รอผู้ตรวจทบทวนและแจ้งการจัดการยอดที่รับแล้ว</p></div>`:timeline(b)}<a class="text-link" href="#/bill/${b.id}">ดูบิลและยอดล่าสุด ${icon('chevron')}</a></article>`;}).join(''):`<div class="empty-state soft-empty">${icon('heart')}<h2>รอยต่อแรก เริ่มได้จากนิดเดียว</h2><p>เมื่อคุณลองช่วย บิลและสถานะจะมาอยู่ตรงนี้<br>ไม่ต้องช่วยมาก ก็เป็นส่วนหนึ่งได้</p><a class="button primary" href="#/bills">เลือกบิลที่อยากช่วย ${icon('arrow')}</a></div>`}</div><div class="activity-proof">${demoProof()}</div></div></section>`;
  }
  function profile() {
    const total=state.contributions.reduce((n,c)=>n+c.amount,0),unique=new Set(state.contributions.map(c=>c.billId)).size;
    return `<section class="view profile-view">${topbar('พื้นที่ของฉัน',{action:`<button class="icon-button" data-settings aria-label="ตั้งค่าพื้นที่ทดลอง">${icon('settings')}</button>`})}<div class="profile-layout"><div><div class="profile-card"><div class="profile-avatar">${icon('user')}</div><h2>เพื่อนคนละนิด</h2><p class="muted">วันนี้เป็นผู้ให้ วันหน้าอาจเป็นผู้รับ</p><span class="demo-pill">พื้นที่ทดลอง · ไม่มีบัญชีจริง</span><div class="profile-stats"><div><b>${state.contributions.length}</b><span>ครั้งที่ช่วย</span></div><div><b>${unique}</b><span>บิลที่ร่วมช่วย</span></div><div><b>${money(total)}</b><span>แรงช่วยรวม</span></div></div></div><div class="value-banner"><span class="value-symbol">${icon('leaf')}</span><div><h2>รอยต่อของน้ำใจ</h2><p>ให้เท่าที่ไหว ไม่มีอันดับผู้ให้<br>และไม่มีภาระต้องตอบแทน</p></div></div></div><div class="profile-menu"><a href="#/activity">${icon('clock')}<span>ประวัติและความคืบหน้าการช่วย</span>${icon('chevron')}</a><button data-my-requests>${icon('file')}<span>คำขอช่วยบิลของฉัน <small>${state.requests.length?`(${state.requests.length})`:''}</small></span>${icon('chevron')}</button><button data-favorites>${icon('heart')}<span>บิลที่เก็บไว้ <small>(${state.favorites.size})</small></span>${icon('chevron')}</button><a href="#/request">${icon('plus')}<span>ลองขอให้ช่วยแบ่งเบาบิล</span>${icon('chevron')}</a><button data-help>${icon('shield')}<span>ความไว้ใจและความเป็นส่วนตัว</span>${icon('chevron')}</button><button data-settings>${icon('settings')}<span>ตั้งค่าพื้นที่ทดลอง</span>${icon('chevron')}</button><p class="small-text">ยอดและรายการคงอยู่เฉพาะระหว่างเปิดหน้านี้<br>รีเฟรชแล้วจะกลับเป็นข้อมูลเริ่มต้น ไม่มีข้อมูลส่งไปภายนอก</p></div></div></section>`;
  }
  function requestProgress(step) {
    return `<div class="request-progress" aria-label="ขั้นตอน ${Math.min(step+1,3)} จาก 3">${[0,1,2].map(i=>`<span class="${i<=step?'active':''}"></span>`).join('')}</div>`;
  }
  function requestView() {
    const d=state.requestDraft,b=getBill(d.type);
    if(state.requestStep===3){
      return `<section class="view request-view">${topbar('ส่งแรงขอไว้แล้ว',{back:'#/me'})}<div class="form-card request-card"><div class="success-check">${icon('clock')}</div><h2>คำขอของคุณอยู่ในคิวตรวจ</h2><p>คำขอ${b.label}ตัวอย่างถูกบันทึกไว้แล้ว<br>ยังไม่เปิดรับยอดช่วย และยังไม่ได้รับอนุมัติ</p><div class="support-note">${icon('shield')}<p>ผู้ตรวจต้องตรวจผู้ขอ สิทธิต่อบิล ยอดค้าง บิลซ้ำ และเงื่อนไขผู้รับชำระ ก่อนประเมินความจำเป็นแยกอีกขั้น</p></div><button class="button primary full" data-my-requests>ดูคำขอตัวอย่างของฉัน</button><button class="button outline full" data-new-request>ลองส่งบิลประเภทอื่น</button></div></section>`;
    }
    let content='';
    if(state.requestStep===0){
      content=`<p class="step-label">01 / บิลและความเกี่ยวข้อง</p><h2>บิลไหนที่อยากให้ช่วยแบ่งเบา</h2><p class="muted">ลองขั้นตอนด้วยข้อมูลที่เตรียมไว้<br>ไม่ต้องกรอกชื่อ ที่อยู่ หรือเอกสารส่วนตัว</p><form id="request-basics"><div class="form-field"><label class="field-label" for="request-type">ประเภทบิล</label><select class="input" id="request-type" name="type">${state.bills.map(x=>`<option value="${x.id}"${x.id===d.type?' selected':''}>${x.label}</option>`).join('')}</select></div><div class="form-field"><label class="field-label" for="request-relation">เกี่ยวข้องกับบิลอย่างไร</label><select class="input" id="request-relation" name="relation"><option value="self"${d.relation==='self'?' selected':''}>เจ้าของบัญชีหรือสัญญา</option><option value="tenant"${d.relation==='tenant'?' selected':''}>ผู้เช่าหรือผู้ใช้งานจริง</option><option value="family"${d.relation==='family'?' selected':''}>ผู้ขอแทนครอบครัวหรือผู้ดูแล</option></select></div><div class="support-note warm">${icon('info')}<p>ผู้ขอแทนต้องมีหลักฐานความเกี่ยวข้องและความยินยอมที่เหมาะสม ตรวจเป็นการส่วนตัว</p></div><button class="button primary full" type="submit">ดูบิลตัวอย่าง ${icon('arrow')}</button></form>`;
    }else if(state.requestStep===1){
      content=`<p class="step-label">02 / เอกสารและความเป็นส่วนตัว</p><h2>ตรวจต้นฉบับ เก็บส่วนตัว</h2><p class="muted">สาธารณะเห็นเท่าที่จำเป็น<br>ต้นแบบนี้ใช้บิลสมมติ ไม่มีการอัปโหลดจริง</p>${documentPreview(b,true)}<div class="trust-checks"><div class="trust-item">${icon('file')}<div><b>ตรวจยอดกับต้นทาง</b><span>OCR ช่วยอ่าน ไม่ได้พิสูจน์ความแท้</span></div></div><div class="trust-item">${icon('eye')}<div><b>ปิดบังข้อมูลก่อนเผยแพร่</b><span>ไม่แสดงชื่อเต็ม ที่อยู่ หรือเลขบัญชีเต็ม</span></div></div></div><div class="modal-actions"><button class="button outline" data-request-back>ย้อนกลับ</button><button class="button primary" data-request-next>ทบทวนคำขอ ${icon('arrow')}</button></div>`;
    }else{
      const duplicate=state.requests.some(r=>r.type===d.type);
      content=`<p class="step-label">03 / ทบทวนก่อนส่ง</p><h2>ก่อนเปิดรับ ตรวจให้ครบ</h2><div class="summary-box"><div class="summary-row"><span>ประเภท</span><b>${b.label}</b></div><div class="summary-row"><span>เป้าหมายตัวอย่าง</span><b>${money(b.goal)}</b></div><div class="summary-row"><span>ความเกี่ยวข้อง</span><b>${{self:'เจ้าของบัญชีหรือสัญญา',tenant:'ผู้เช่าหรือผู้ใช้งานจริง',family:'ผู้ขอแทนครอบครัวหรือผู้ดูแล'}[d.relation]}</b></div><div class="summary-row"><span>ผู้รับชำระ</span><b>${b.provider}</b></div></div>${b.conditional?`<div class="support-note warm">${icon('info')}<p>${b.condition}<br>${b.after}</p></div>`:''}<div class="support-note">${icon('clock')}<p>ส่งแล้วอยู่สถานะรอตรวจ ยังไม่เปิดรับยอดช่วย<br>ไม่มีเอกสารหรือข้อมูลจริงถูกส่งออกไป</p></div>${duplicate?`<p class="field-error" role="alert">มีคำขอของบัญชีและรอบบิลตัวอย่างนี้รอตรวจแล้ว ส่งซ้ำไม่ได้</p><button class="button primary full" data-my-requests>ดูคำขอเดิม</button>`:`<button class="button primary full" data-request-submit>จำลองส่งคำขอเข้าคิวตรวจ ${icon('arrow')}</button>`}<button class="text-link request-back" data-request-back>${icon('back')} กลับไปตรวจข้อมูล</button>`;
    }
    return `<section class="view request-view">${topbar('ขอให้ช่วยแบ่งเบาบิล',{back:'#/me',intro:'ทุกคนมีวันที่ติดขัดได้'})}<div class="request-layout"><div class="request-intro"><span class="category-icon electricity">${icon('file')}</span><h2>วันนี้รับแรงช่วย<br>วันหน้าอาจส่งต่อ</h2><p>ไม่ต้องเปิดหน้า ไม่ต้องแข่งเล่าเรื่องเศร้า<br>และไม่มีภาระคืนเงินให้ผู้ช่วย</p><button class="text-link" data-help>อ่านวิธีดูแลความไว้ใจ ${icon('chevron')}</button></div><div class="form-card request-card">${requestProgress(state.requestStep)}${content}</div></div></section>`;
  }
  function openSupport(html, title='คนละนิด · ความไว้ใจ') {
    if(!dialog||!support)return;
    if(!dialog.open)lastFocus=document.activeElement;
    support.innerHTML=html;dialog.setAttribute('aria-label',title);
    if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
    const heading=support.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
    hydrateIcons(support);
  }
  function closeSupport() {if(dialog?.open)dialog.close();}
  function trustModal() {
    openSupport(`<div class="modal-body"><p class="eyebrow">ช่วยกันอย่างไว้ใจได้</p><h2 class="modal-title">ความไว้ใจ มีมากกว่ารูปบิล</h2><p>ทุกความสามารถด้านการตรวจและการจ่ายบนต้นแบบเป็นสถานะสมมติ ยังไม่มีการตรวจคนหรือเชื่อมต่อผู้รับบิลจริง</p>${checks()}<div class="support-note warm">${icon('info')}<p>การตรวจบิลช่วยยืนยันภาระที่พบ แต่ไม่พิสูจน์ความเดือดร้อนหรือรับประกันว่าไม่มีการทุจริต จึงต้องมีคนประเมิน รายงาน พักเคส และขอทบทวนได้</p></div><details class="faq" open><summary>เงินควรเดินทางอย่างไร ${icon('chevron')}</summary><p>รวมยอดตามเป้าหมาย ตรวจยอดค้างล่าสุด แล้วจ่ายตรงผู้รับบิลผ่านพาร์ทเนอร์ที่รองรับ ไม่โอนเข้าบัญชีผู้ขอ และไม่ใช้ QR ที่อัปโหลดมาเป็นคำสั่งจ่าย</p></details><details class="faq"><summary>ถ้าจ่ายไม่ได้หรือรวบรวมไม่ครบ ${icon('chevron')}</summary><p>หยุดรับเพิ่มและตรวจสอบก่อน ไม่ย้ายเงินไปบิลอื่นเอง คืนผ่านช่องทางเดิมตามเงื่อนไขพาร์ทเนอร์ พร้อมแยก “กำลังคืน” กับ “คืนแล้ว” ระยะเวลาและค่าธรรมเนียมต้องแจ้งก่อนรับเงินจริง</p></details><details class="faq"><summary>ดูแลข้อมูลส่วนตัวอย่างไร ${icon('chevron')}</summary><p>ผู้ช่วยเห็นเฉพาะขอบเขตการตรวจ เลขอ้างอิงที่ปิดบัง ยอด และผลชำระ ผู้ตรวจเข้าถึงเอกสารตามหน้าที่ มีบันทึกการเข้าถึง ระยะเก็บ และกระบวนการลบ ไม่บังคับให้เปิดหน้าหรือโพสต์คำขอบคุณ</p></details><details class="faq"><summary>รถและบัตรเครดิตมีข้อจำกัดอะไร ${icon('chevron')}</summary><p>เปิดได้เมื่อยืนยันเงื่อนไขกับเจ้าหนี้รายนั้นแล้ว รถช่วยเฉพาะงวดที่ระบุ บัตรเครดิตต้องแสดงยอดที่ช่วยและหนี้ที่ยังเหลือ การช่วยบางส่วนไม่รับประกันว่าปิดหนี้ หยุดค่าปรับ การติดตามหนี้ หรือการยึดรถได้</p></details><details class="faq"><summary>ข้อมูลประกอบแนวทาง ${icon('chevron')}</summary><ul class="source-links"><li><a href="https://www.pwa.co.th/news/view/116456" target="_blank" rel="noopener noreferrer">กปภ. เตือนบิลปลอมและการเปลี่ยน QR</a></li><li><a href="https://www.pea.co.th/our-services/payment-channel" target="_blank" rel="noopener noreferrer">กฟภ. ช่องทางการชำระค่าไฟ</a></li><li><a href="https://www.bot.or.th/th/our-roles/payment-systems/back-up-payment/payment-faq0.html" target="_blank" rel="noopener noreferrer">ธปท. คำถามพบบ่อยเรื่องระบบชำระเงิน</a></li><li><a href="https://www.kasikornbank.com/th/Download/Level4_doc/CreditCardManual.pdf" target="_blank" rel="noopener noreferrer">กสิกรไทย คู่มือบัตรเครดิต</a></li></ul><p class="small-text">ข้อมูลประกอบตรวจเมื่อ 26 ต.ค. 2569 ไม่ใช่การรับรองหรือการเข้าร่วมจากหน่วยงานเหล่านี้</p></details><button class="button primary full" data-close>เข้าใจแล้ว</button></div>`);
  }
  function reportModal(id) {
    const b=getBill(id);if(!b)return;
    openSupport(`<div class="modal-body"><p class="eyebrow">ช่วยกันดูแลความไว้ใจ</p><h2 class="modal-title">มีจุดไหนที่ควรตรวจอีกครั้ง</h2><p class="muted">${b.title} · รายงานตัวอย่าง</p><form id="report-form" data-bill="${b.id}"><fieldset class="report-options"><legend class="field-label">เลือกเหตุผล ไม่ต้องระบุข้อมูลส่วนตัว</legend>${[['duplicate','บิลอาจซ้ำหรือชำระไปแล้ว'],['destination','ผู้รับเงินหรือเลขอ้างอิงผิดปกติ'],['outside','มีการชวนให้โอนนอกระบบ'],['privacy','เปิดเผยข้อมูลส่วนตัวเกินจำเป็น']].map(([v,t],i)=>`<label class="radio-label"><input type="radio" name="reason" value="${v}"${!i?' checked':''} required>${t}</label>`).join('')}</fieldset><button class="button coral full" type="submit">จำลองรายงานและพักรับยอด</button><p class="small-text">ไม่ส่งรายงานถึงบุคคลหรือหน่วยงานจริง</p></form></div>`,'รายงานบิลตัวอย่าง');
  }
  function reportStatus(b) {
    openSupport(`<div class="modal-body"><span class="category-icon credit">${icon('flag')}</span><h2 class="modal-title">บิลนี้อยู่ระหว่างทบทวน</h2><p>${b.title}</p><div class="support-note warm">${icon('clock')}<p>พักการรับยอดเพิ่ม รอผู้ตรวจพิจารณาข้อเท็จจริง<br>ไม่เปิดเผยผู้รายงาน และผู้ขอต้องมีช่องทางขอทบทวน</p></div><p class="small-text">นี่เป็นสถานะสมมติ ยังไม่มีทีมงานรับเรื่องจริง รีเซ็ตได้ที่พื้นที่ทดลอง</p><button class="button primary full" data-close>เข้าใจแล้ว</button></div>`,'สถานะทบทวนบิล');
  }
  function notificationsModal() {
    openSupport(`<div class="modal-body"><p class="eyebrow">ความเคลื่อนไหวของคุณ</p><h2 class="modal-title">การแจ้งเตือน</h2>${state.notifications.length?`<ul class="notifications-list">${[...state.notifications].reverse().map(n=>`<li>${icon(n.icon)}<div><b>${n.title}</b><p>${n.text}</p></div></li>`).join('')}</ul>`:`<div class="empty-state">${icon('bell')}<h3>ยังไม่มีความเคลื่อนไหว</h3><p>เมื่อคุณลองช่วยหรือส่งคำขอ<br>รายการตัวอย่างจะมาอยู่ตรงนี้</p></div>`}<button class="button outline full" data-close>กลับไปดูบิล</button></div>`,'การแจ้งเตือน');
  }
  function favoritesModal() {
    const saved=state.bills.filter(b=>state.favorites.has(b.id));
    openSupport(`<div class="modal-body"><h2 class="modal-title">บิลที่เก็บไว้</h2>${saved.length?`<div class="saved-list">${saved.map(b=>`<a class="saved-item" href="#/bill/${b.id}" data-close-on-nav><span class="category-icon ${b.id}">${icon(b.icon)}</span><span><b>${b.title}</b><small>ยังขาด ${money(missing(b))}</small></span>${icon('chevron')}</a>`).join('')}</div>`:`<div class="empty-state">${icon('heart')}<p>แตะหัวใจบนบิลที่อยากกลับมาดู<br>บิลนั้นจะมาอยู่ตรงนี้</p></div>`}<button class="button outline full" data-close>เข้าใจแล้ว</button></div>`,'บิลที่เก็บไว้');
  }
  function myRequestsModal() {
    openSupport(`<div class="modal-body"><p class="eyebrow">รอคนช่วยดูแล</p><h2 class="modal-title">คำขอช่วยบิลของฉัน</h2>${state.requests.length?`<div class="activity-list">${state.requests.map(r=>{const b=getBill(r.type);return `<article class="activity-card"><div class="section-label"><h3>${b.label} · ${money(b.goal)}</h3><span class="status-pill pending">${icon('clock')}รอตรวจ</span></div><p class="small-text">${r.id} · ยังไม่เปิดรับยอดช่วย</p><p>ตรวจผู้ขอและสิทธิต่อบิล ยอดจากต้นทาง บิลซ้ำ และความจำเป็น ก่อนเปิดรับช่วย</p></article>`;}).join('')}</div>`:`<div class="empty-state">${icon('file')}<p>ยังไม่มีคำขอในพื้นที่ทดลองนี้</p></div>`}<a class="button primary full" href="#/request" data-new-request-link data-close-on-nav>ลองขอให้ช่วยแบ่งเบาบิล</a></div>`,'คำขอช่วยบิลของฉัน');
  }
  function settingsModal() {
    openSupport(`<div class="modal-body"><h2 class="modal-title">พื้นที่ทดลองของคุณ</h2><p>ต้นแบบนี้ใช้ข้อมูลสมมติทั้งหมด ไม่มีบัญชีผู้ใช้ การตรวจตัวตน การรับเงินจริง หรือการอัปโหลดเอกสารจริง</p><div class="summary-box"><div class="summary-row"><span>รายการช่วยในหน้านี้</span><b>${state.contributions.length} รายการ</b></div><div class="summary-row"><span>คำขอรอตรวจ</span><b>${state.requests.length} รายการ</b></div><div class="summary-row"><span>บิลที่พักตรวจ</span><b>${state.paused.size} บิล</b></div></div><p class="small-text">รีเฟรชแล้วสถานะทั้งหมดจะกลับเริ่มต้น<br>หรือล้างได้จากปุ่มด้านล่าง</p><button class="button outline full" data-reset-ask>ล้างสถานะตัวอย่าง</button><button class="button primary full" data-close>กลับไปใช้งาน</button></div>`,'ตั้งค่าพื้นที่ทดลอง');
  }
  function resetState() {
    state.bills=initialBills.map(b=>({...b}));state.contributions=[];state.requests=[];state.favorites.clear();state.paused.clear();state.drafts={};state.filter='all';state.search='';state.proofStage=0;state.requestStep=0;state.requestDraft={type:'electricity',relation:'self'};state.lastReceipt=null;state.notifications=[];
    closeSupport();go('/');toast('กลับสู่ข้อมูลตัวอย่างเริ่มต้นแล้ว');
  }
  function render({focus=true, restore=false}={}) {
    const path=route(); const segments=path.split('/').filter(Boolean); let html='',active='home';
    if(path==='/')html=home();
    else if(path==='/bills'){html=browse();active='browse';}
    else if(path==='/activity'){html=activity();active='activity';}
    else if(path==='/me'){html=profile();active='profile';}
    else if(path==='/request'){html=requestView();active='profile';}
    else if(['bill','help','review','received'].includes(segments[0])&&segments.length===2){
      const b=getBill(segments[1]);active='browse';
      if(b)html=({bill:detail,help,review,received}[segments[0]])(b);
    }
    if(!html)html=`<section class="view">${topbar('หน้านี้อาจย้ายไปแล้ว')}<div class="empty-state">${icon('file')}<p>กลับไปเลือกบิลที่อยากช่วยกันอีกครั้งได้เลย</p><a class="button primary" href="#/bills">ไปที่บิลที่รอเรา</a></div></section>`;
    app.innerHTML=html;app.dataset.view=segments[0]||'home';document.body.dataset.route=segments[0]||'home';
    document.querySelectorAll('[data-nav]').forEach(el=>{const on=el.dataset.nav===active;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    hydrateIcons();
    const heading=app.querySelector('h1');if(focus&&heading)heading.focus({preventScroll:true});
    if(restore)window.scrollTo({top:scrollPositions.get(location.hash)||0,behavior:'instant'});
    currentHash=location.hash;
  }
  function updateAmountForm(showError=true) {
    const form=document.querySelector('#help-form');if(!form)return false;
    const b=getBill(form.dataset.bill),input=form.querySelector('#custom-amount'),raw=input.value;
    const value=raw===''?NaN:Number(raw),error=amountError(b,value);
    const d=getDraft(b);if(!error)d.amount=value;
    if(showError){form.querySelector('#amount-error').textContent=error;input.setAttribute('aria-invalid',String(!!error));}
    form.querySelectorAll('[data-amount]').forEach(el=>{const on=Number(el.dataset.amount)===value;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on));});
    return !error;
  }
  function confirmContribution(id) {
    const b=getBill(id),d=b&&state.drafts[id];
    if(processing||!b||!d||d.consumed)return;
    if(state.paused.has(id)||!missing(b)){render();toast('สถานะบิลเปลี่ยนแล้ว โปรดตรวจอีกครั้ง');return;}
    const error=amountError(b,d.amount);
    if(error){go(`/help/${id}`);toast(error);return;}
    processing=true;
    const button=document.querySelector('#confirm-help');if(button)button.disabled=true;
    const receipt={id:`KL-${String(state.contributions.length+1).padStart(3,'0')}`,billId:id,amount:d.amount,anonymous:d.anonymous,message:d.message};
    d.consumed=true;b.raised+=d.amount;b.helpers+=1;state.contributions.push(receipt);state.lastReceipt=receipt;
    state.notifications.push({icon:'heart',title:`รับแรงช่วย ${money(d.amount)} แล้ว`,text:`${b.title} · ยังรอ${missing(b)?'รวบรวมยอด':'ส่งชำระ'} ไม่ใช่ผลชำระบิล`});
    processing=false;go(`/received/${id}`);
  }

  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.matches('[data-close]')){event.preventDefault();closeSupport();return;}
    if(target.matches('[data-close-on-nav]'))closeSupport();
    if(target.matches('[data-new-request-link]')){event.preventDefault();state.requestStep=0;go('/request');return;}
    if(target.matches('[data-help]')){event.preventDefault();trustModal();return;}
    if(target.matches('[data-notifications]')){notificationsModal();return;}
    if(target.matches('[data-filter]')){
      state.filter=target.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(el=>{const on=el===target;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on));});
      document.querySelector('#bills-results').innerHTML=browseCards();return;
    }
    if(target.matches('[data-clear-search]')){state.search='';state.filter='all';render({focus:false});document.querySelector('#bill-search')?.focus();return;}
    if(target.matches('[data-save]')){
      const id=target.dataset.save;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
      document.querySelectorAll(`[data-save="${id}"]`).forEach(el=>{const on=state.favorites.has(id);el.classList.toggle('is-saved',on);el.setAttribute('aria-pressed',String(on));el.setAttribute('aria-label',`${on?'ยกเลิกเก็บ':'เก็บ'}${getBill(id).title}`);});
      toast(state.favorites.has(id)?'เก็บบิลนี้ไว้กลับมาดูแล้ว':'ยกเลิกเก็บบิลแล้ว');return;
    }
    if(target.matches('[data-start-help]')){const b=getBill(target.dataset.startHelp);if(b){if(state.paused.has(b.id)||!missing(b)){go(`/bill/${b.id}`);return;}getDraft(b,true);go(`/help/${b.id}`);}return;}
    if(target.matches('[data-amount]')){const form=document.querySelector('#help-form');form.querySelector('#custom-amount').value=target.dataset.amount;updateAmountForm();return;}
    if(target.matches('[data-confirm]')){confirmContribution(target.dataset.confirm);return;}
    if(target.matches('[data-report]')){reportModal(target.dataset.report);return;}
    if(target.matches('[data-report-status]')){reportStatus(getBill(target.dataset.reportStatus));return;}
    if(target.matches('[data-proof-stage]')){
      state.proofStage=Number(target.dataset.proofStage);const old=document.querySelector('.demo-proof-section');
      const holder=document.createElement('div');holder.innerHTML=demoProof();old.replaceWith(holder.firstElementChild);
      document.querySelector(`[data-proof-stage="${state.proofStage}"]`)?.focus({preventScroll:true});return;
    }
    if(target.matches('[data-request-next]')){state.requestStep=Math.min(2,state.requestStep+1);render();window.scrollTo({top:0,behavior:'instant'});return;}
    if(target.matches('[data-request-back]')){state.requestStep=Math.max(0,state.requestStep-1);render();window.scrollTo({top:0,behavior:'instant'});return;}
    if(target.matches('[data-request-submit]')){
      if(state.requests.some(r=>r.type===state.requestDraft.type)){toast('มีคำขอบิลนี้รอตรวจแล้ว');return;}
      const b=getBill(state.requestDraft.type),request={...state.requestDraft,id:`KL-REQ-${String(state.requests.length+1).padStart(3,'0')}`};
      state.requests.push(request);state.notifications.push({icon:'clock',title:'คำขอตัวอย่างเข้าคิวแล้ว',text:`${b.label} · รอตรวจ ยังไม่เปิดรับยอดช่วย`});state.requestStep=3;render();window.scrollTo({top:0,behavior:'instant'});return;
    }
    if(target.matches('[data-new-request]')){state.requestStep=0;render();window.scrollTo({top:0,behavior:'instant'});return;}
    if(target.matches('[data-my-requests]')){myRequestsModal();return;}
    if(target.matches('[data-favorites]')){favoritesModal();return;}
    if(target.matches('[data-settings]')){settingsModal();return;}
    if(target.matches('[data-reset-ask]')){openSupport(`<div class="modal-body"><h2 class="modal-title">ล้างสถานะตัวอย่างทั้งหมด?</h2><p>รายการช่วย คำขอ บิลที่เก็บ และสถานะพักเคสในหน้านี้จะกลับเป็นค่าเริ่มต้น ไม่มีข้อมูลจริงหรือเงินจริงเกี่ยวข้อง</p><div class="modal-actions"><button class="button outline" data-settings>เก็บไว้ก่อน</button><button class="button coral" data-reset-confirm>ล้างและเริ่มใหม่</button></div></div>`,'ยืนยันล้างสถานะตัวอย่าง');return;}
    if(target.matches('[data-reset-confirm]')){resetState();return;}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='bill-search'){
      state.search=event.target.value;document.querySelector('#bills-results').innerHTML=browseCards();return;
    }
    if(event.target.id==='custom-amount')updateAmountForm(false);
  });
  document.addEventListener('focusout',event=>{if(event.target.id==='custom-amount')updateAmountForm(true);});
  document.addEventListener('change',event=>{
    const form=document.querySelector('#help-form');
    if(form&&['anonymous','encouragement'].includes(event.target.id)){
      const d=getDraft(getBill(form.dataset.bill));d.anonymous=form.querySelector('#anonymous').checked;d.message=form.querySelector('#encouragement').value;
    }
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='help-form'){
      event.preventDefault();const b=getBill(event.target.dataset.bill);
      if(!updateAmountForm(true)){document.querySelector('#custom-amount').focus();return;}
      if(state.paused.has(b.id)||!missing(b)){render();toast('สถานะบิลเปลี่ยนแล้ว');return;}
      const d=getDraft(b);d.anonymous=document.querySelector('#anonymous').checked;d.message=document.querySelector('#encouragement').value;go(`/review/${b.id}`);
    }
    if(event.target.id==='request-basics'){
      event.preventDefault();state.requestDraft.type=document.querySelector('#request-type').value;state.requestDraft.relation=document.querySelector('#request-relation').value;state.requestStep=1;render();window.scrollTo({top:0,behavior:'instant'});
    }
    if(event.target.id==='report-form'){
      event.preventDefault();const b=getBill(event.target.dataset.bill);if(!b)return;
      state.paused.add(b.id);state.notifications.push({icon:'flag',title:'พักรับยอดช่วยตัวอย่างแล้ว',text:`${b.title} · รอผู้ตรวจทบทวน`});render({focus:false});
      openSupport(`<div class="modal-body"><span class="category-icon credit">${icon('flag')}</span><h2 class="modal-title">รับรายงานตัวอย่างแล้ว</h2><p>เคสนี้พักการรับยอดเพิ่ม รอผู้ตรวจทบทวน<br>ไม่อนุมัติกลับโดยอัตโนมัติ</p><div class="support-note">${icon('shield')}<p>บริการจริงต้องปิดบังผู้รายงาน ตรวจข้อเท็จจริง ให้ผู้ขออุทธรณ์ได้ และแจ้งการจัดการยอดที่รับแล้วตามผลตรวจ</p></div><p class="small-text">ไม่มีรายงานถูกส่งถึงทีมงานจริง</p><button class="button primary full" data-close>เข้าใจแล้ว</button></div>`,'ผลการรายงานบิลตัวอย่าง');
    }
  });
  if(dialog){
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeSupport();}});
    dialog.addEventListener('close',()=>{if(lastFocus&&document.contains(lastFocus))lastFocus.focus({preventScroll:true});else app.querySelector('h1')?.focus({preventScroll:true});});
  }
  window.addEventListener('hashchange',()=>{
    if(currentHash)scrollPositions.set(currentHash,window.scrollY);
    closeSupport();render({restore:true});
  });
  if(app){hydrateIcons();render({focus:false});}
})();
