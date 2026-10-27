'use strict';

(() => {
  const trafficScript = document.createElement('script');
  trafficScript.type = 'module'; trafficScript.src = '/traffic.js';
  document.head.appendChild(trafficScript);
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    bills: '<path d="M6 2h9l4 4v16l-3-2-4 2-4-2-3 2V3a1 1 0 0 1 1-1Z"/><path d="M14 2v5h5M8 11h7m-7 4h5"/>',
    heart: '<path d="M20.5 4.8a5.2 5.2 0 0 0-7.4 0L12 5.9l-1.1-1.1a5.2 5.2 0 0 0-7.4 7.4L12 21l8.5-8.8a5.2 5.2 0 0 0 0-7.4Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
    shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
    check: '<path d="m6 12 4 4 8-9"/><circle cx="12" cy="12" r="10"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    flag: '<path d="M4 22V3m0 1c5-4 10 4 16 0v11c-6 4-11-4-16 0"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
    leaf: '<path d="M20 3C9 1 2 7 5 15s16 8 15-12Z"/><path d="M3 22 16 8M8 16l-1-6m5 2h5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    drop: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/><path d="M9 17a3 3 0 0 0 3 2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
    car: '<path d="m5 6-2 6v7h3v-3h12v3h3v-7l-2-6H5Z"/><path d="M3 12h18M7 6l1-3h8l1 3M6 14h2m8 0h2"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4m4 0h3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.1"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
    bookmark: '<path d="M6 3h12v18l-6-4.5L6 21V3Z"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-5.6A8 8 0 1 1 21 12Z"/><path d="M8 11h8M8 14.5h5"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/>',
    megaphone: '<path d="M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M17 8a5 5 0 0 1 0 8M7 15l1.5 5h3L10 16"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1.5A5.5 5.5 0 0 1 7.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 4 5v2"/>'
  };
  const icon = (name, extra = '') => `<svg class="${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  const money = n => `฿${Number(n).toLocaleString('en-US')}`;
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const typeIcon = {electricity:'bolt', water:'drop', phone:'phone', car:'car', credit:'card'};

  // Bills and the backend connection come from data.js, which the team edits by hand.
  const config = window.KONLANID || {};
  const backend = config.backend && config.backend.url && config.backend.key ? config.backend : null;
  const OVERDUE_LIMIT_DAYS = 30;
  const RECEIPT_DAYS = 7;
  const digits = v => String(v || '').replace(/\D/g, '');
  // Helpers transfer to the requester's own PromptPay: a mobile number (10 digits), national/tax ID (13) or e-wallet (15).
  const validPromptPay = v => [10, 13, 15].includes(digits(v).length);
  const bills = (config.bills || []).filter(b => b && b.id && b.title && b.goal > 0 && b.pay && validPromptPay(b.pay.promptpay)).map(b => ({raised:0, helpers:0, status:'open', ...b}));

  // What this browser has pledged. Kept on this device only; the public totals come from data.js.
  const STORE = 'konlanid:v1';
  const load = () => {try {return JSON.parse(localStorage.getItem(STORE)) || {};} catch {return {};}};
  const saved = load();
  const state = {
    pledges: Array.isArray(saved.pledges) ? saved.pledges : [],
    favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites : []),
    amounts: {}, filter: 'all', search: '', sending: false
  };
  const persist = () => {try {localStorage.setItem(STORE, JSON.stringify({pledges:state.pledges, favorites:[...state.favorites]}));} catch {}};

  const app = document.querySelector('#app');
  const dialog = document.querySelector('#support-dialog');
  const support = document.querySelector('#support-content');
  const scrollPositions = new Map();
  let currentHash = '', lastFocus = null, toastTimer;
  const getBill = id => bills.find(b => b.id === id);
  const missing = b => Math.max(0, Math.round((b.goal - b.raised) * 100) / 100);
  const daysLeft = b => {
    const due = new Date(`${b.dueDate}T23:59:59+07:00`);
    return b.dueDate && !Number.isNaN(due.getTime()) ? Math.ceil((due - Date.now()) / 86400000) : null;
  };
  // Bills overdue by more than a month close automatically: service may already be cut off.
  const tooOverdue = b => daysLeft(b) !== null && daysLeft(b) < 1 - OVERDUE_LIMIT_DAYS;
  const isOpen = b => b.status === 'open' && missing(b) > 0 && !tooOverdue(b);
  const route = () => (location.hash.slice(1) || '/').split('?')[0];
  const params = () => new URLSearchParams((location.hash.split('?')[1]) || '');
  const dueText = b => {
    const days = daysLeft(b);
    if (days === null) return '';
    return days > 1 ? `เหลืออีก ${days} วัน` : days === 1 ? 'ครบกำหนดวันนี้' : `เกินกำหนด ${1 - days} วัน`;
  };
  const dueDate = b => {
    const d = new Date(`${b.dueDate}T12:00:00+07:00`);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'numeric'});
  };
  const contactLink = (topic, b, amount) => `#/contact?topic=${topic}${b ? `&bill=${encodeURIComponent(b.id)}` : ''}${amount ? `&amount=${amount}` : ''}`;

  // Thai QR Payment for PromptPay (EMVCo tag 29) with the amount filled in; every Thai bank app can scan it.
  const tlv = (id, value) => `${id}${String(value.length).padStart(2, '0')}${value}`;
  function crc16(text) {
    let crc = 0xFFFF;
    for (const byte of new TextEncoder().encode(text)) {
      crc ^= byte << 8;
      for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
  function promptPayPayload(id, amount) {
    const d = digits(id);
    const target = d.length === 10 ? tlv('01', `0066${d.slice(1)}`) : d.length === 13 ? tlv('02', d) : tlv('03', d);
    const body = tlv('00', '01') + tlv('01', '12') + tlv('29', tlv('00', 'A000000677010111') + target) + tlv('53', '764') + tlv('54', Number(amount).toFixed(2)) + tlv('58', 'TH') + '6304';
    return body + crc16(body);
  }
  const maskPromptPay = id => {const d = digits(id); return d.length === 10 ? `${d.slice(0, 3)}-xxx-${d.slice(6)}` : `${'x'.repeat(d.length - 4)}${d.slice(-4)}`;};
  function promptPayImage(b, amount) {
    const qr = window.qrcode(0, 'M'); qr.addData(promptPayPayload(b.pay.promptpay, amount)); qr.make();
    const cells = qr.getModuleCount(), cell = 8, quiet = 4 * cell, size = cells * cell + quiet * 2, font = 24;
    const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size + font * 3;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#1d3b2c';
    for (let r = 0; r < cells; r++) for (let c = 0; c < cells; c++) if (qr.isDark(r, c)) ctx.fillRect(quiet + c * cell, quiet + r * cell, cell, cell);
    ctx.textAlign = 'center'; ctx.font = `600 ${font}px "Noto Sans Thai", sans-serif`;
    ctx.fillText(`คนละนิด · พร้อมเพย์ · ${money(amount)}`, size / 2, size + font * 1.6);
    return canvas.toDataURL('image/png');
  }

  function hydrateIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {el.innerHTML = icon(el.dataset.icon);});
  }
  function toast(message) {
    const el = document.querySelector('#toast');
    if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }
  async function copyText(text, done) {
    try {await navigator.clipboard.writeText(text); toast(done);}
    catch {toast('คัดลอกไม่ได้ กดค้างที่ตัวเลขเพื่อคัดลอกเองนะ');}
  }
  async function shareLink(bill) {
    const url = location.href.split('#')[0] + (bill ? `#/bill/${bill.id}` : '');
    const text = bill ? `ช่วยกันคนละนิด ${bill.title} ขาดอีก ${money(missing(bill))}` : 'ไม่ต้องมีมาก แค่ช่วยกันคนละนิด ก็แบ่งเบาบิลของใครอีกคนได้';
    try {
      if (navigator.share) {await navigator.share({title:'คนละนิด', text, url}); return;}
      await navigator.clipboard.writeText(`${text} ${url}`); toast('คัดลอกลิงก์แล้ว ส่งต่อให้เพื่อนได้เลย');
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      openSupport(`<div class="modal-body"><h2 class="modal-title">ส่งลิงก์นี้ให้เพื่อนได้เลย</h2><p class="muted">${safe(text)}</p><input class="input" readonly value="${safe(url)}" aria-label="ลิงก์คนละนิด" onfocus="this.select()"><button class="button primary full" data-close>เรียบร้อย</button></div>`, 'บอกต่อคนละนิด');
    }
  }
  function go(path) {
    if (route() === path) {render(); return;}
    location.hash = path;
  }
  function topbar(title, {back = false, action = ''} = {}) {
    return `<header class="view-header"><div>${back ? `<a class="back-link" href="${back}">${icon('back')}<span>ย้อนกลับ</span></a>` : ''}<h1 class="view-title" tabindex="-1">${title}</h1></div>${action}</header>`;
  }
  function backButton(href, label = 'ย้อนกลับ') {
    return `<a class="back-link" href="${href}">${icon('back')}<span>${label}</span></a>`;
  }
  function statusPill(b) {
    if (b.status === 'paid') return `<span class="status-pill paid">${icon('check')}จ่ายบิลแล้ว</span>`;
    if (b.status === 'closed') return `<span class="status-pill paused">${icon('clock')}ปิดรับแล้ว</span>`;
    if (tooOverdue(b)) return `<span class="status-pill paused">${icon('clock')}ค้างเกิน 1 เดือน · ปิดรับ</span>`;
    if (!missing(b)) return `<span class="status-pill pending">${icon('clock')}ครบยอด · รอใบเสร็จ</span>`;
    return b.verified ? `<span class="status-pill verified">${icon('check')}ทีมตรวจตัวตนและบิลแล้ว</span>` : '';
  }
  function progress(b) {
    return `<div class="progress" role="progressbar" aria-label="ยอดที่ช่วยแล้วของ${safe(b.title)}" aria-valuemin="0" aria-valuemax="${b.goal}" aria-valuenow="${b.raised}"><span style="transform:scaleX(${Math.min(1, b.raised / b.goal)})"></span></div>`;
  }
  function balance(b, extra = '') {
    const gap = missing(b);
    const line = gap ? `<b class="amount-main"><small>ขาดอีก</small> ${money(gap)}</b> <span class="balance-sub">· ช่วยแล้ว ${money(b.raised)} จาก ${money(b.goal)}</span>` : `<b class="amount-main"><small>ครบยอด</small> ${money(b.goal)}</b>`;
    return `<p class="balance-line">${line}</p>${progress(b)}<p class="bill-meta">${b.helpers} คนร่วมช่วย${extra ? ` · ${extra}` : ''}</p>`;
  }
  function categoryIcon(b) {
    return `<span class="category-icon ${safe(b.type)}">${icon(typeIcon[b.type] || 'file')}</span>`;
  }
  function saveButton(b, cls = '') {
    const fav = state.favorites.has(b.id);
    return `<button class="icon-button ${cls}${fav ? ' is-saved' : ''}" data-save="${b.id}" aria-pressed="${fav}" aria-label="${fav ? 'ยกเลิกเก็บ' : 'เก็บ'}${safe(b.title)}">${icon('bookmark')}</button>`;
  }
  function billCard(b) {
    return `<article class="bill-card">
      <div class="bill-card-top">${categoryIcon(b)}<div class="bill-card-heading"><a href="#/bill/${b.id}" class="bill-card-title">${safe(b.title)}</a><p class="bill-meta">โดย ${safe(b.alias)}${b.region ? `<br>${safe(b.region)}` : ''}</p></div>${saveButton(b, 'bill-save')}</div>
      ${balance(b, isOpen(b) ? dueText(b) : '')}
      <div class="bill-card-bottom"><div>${statusPill(b)}</div><a class="button coral bill-card-action" href="#/bill/${b.id}">${isOpen(b) ? 'ช่วยอีกนิด' : 'ดูบิล'} ${icon('arrow')}</a></div>
    </article>`;
  }
  function noBills() {
    return `<div class="empty-state soft-empty">${icon('heart')}<h2>ตอนนี้ยังไม่มีบิลที่เปิดรับ</h2><p>ทีมกำลังเตรียมเปิดรับบิลแรก<br>ถ้าคุณหรือคนที่รู้จักติดขัดเรื่องบิล ส่งเรื่องมาได้เลย</p><a class="button primary" href="${contactLink('ask_help')}">ส่งเรื่องถึงทีม ${icon('arrow')}</a><button class="button soft" data-share>บอกต่อคนละนิด ${icon('megaphone')}</button></div>`;
  }
  function home() {
    const open = bills.filter(isOpen);
    const cta = open.length ? `<a class="button primary hero-cta" href="#/bills">ช่วยจ่ายคนละนิด ${icon('arrow')}</a>` : `<p class="home-status">${icon('clock')} ตอนนี้ยังไม่มีบิลที่เปิดรับ</p><a class="button primary hero-cta" href="${contactLink('ask_help')}">ส่งเรื่องถึงทีม ${icon('arrow')}</a>`;
    return `<section class="view home-view">
      <div class="home-layout"><div class="home-hero"><h1 class="view-title home-title" tabindex="-1">วันนี้<br>ช่วยกันคนละนิดไหม?</h1><p class="home-description">ไม่ต้องมีมาก ไม่ต้องรู้จักกัน<br>แค่คนละนิดก็ช่วยให้ใครอีกคนไปต่อได้</p><img class="home-art" src="assets/helping-hand.webp" width="720" height="480" alt="ภาพวาดมือประคองหัวใจ สื่อถึงการแบ่งปัน" fetchpriority="high">${cta}
      <div class="quick-actions"><a class="quick-action" href="#/bills"><span class="quick-icon pink">${icon('heart')}</span><span>ช่วยจ่าย<br>คนละนิด</span></a><a class="quick-action" href="#/request"><span class="quick-icon yellow">${icon('send')}</span><span>ส่งต่อ<br>คนละนิด</span></a><button class="quick-action" data-share><span class="quick-icon coral">${icon('megaphone')}</span><span>บอกต่อ<br>คนละนิด</span></button><a class="quick-action" href="#/activity"><span class="quick-icon mint">${icon('users')}</span><span>รวมกัน<br>คนละนิด</span></a></div></div>
      ${open.length ? `<div class="home-bills"><div class="section-label"><h2>บิลที่รอเรา</h2><a class="text-link" href="#/bills">ดูทั้งหมด ${icon('chevron')}</a></div><div class="bill-list">${open.slice(0, 2).map(billCard).join('')}</div></div>` : ''}</div>
      <div class="value-banner"><span class="value-symbol">${icon('leaf')}</span><div><h2>คนละนิด ไม่ใช่จำนวนเงิน</h2><p>แต่คือสิ่งที่เราทำให้กันได้ · ให้เท่าที่ไหว ไม่มีภาระต้องตอบแทน</p></div></div>
    </section>`;
  }
  function browse() {
    const types = [...new Map(bills.map(b => [b.type, b.label])).entries()];
    return `<section class="view browse-view">${topbar('บิลที่รอเรา')}${bills.length ? `<div class="browse-toolbar"><label class="search-field" for="bill-search">${icon('search')}<input class="input" id="bill-search" type="search" placeholder="ค้นหาบิล เช่น ค่าไฟ ค่าน้ำ" value="${safe(state.search)}" autocomplete="off" aria-label="ค้นหาบิล"></label>${types.length > 1 ? `<div class="filters" role="group" aria-label="ประเภทบิล">${[['all', 'ทั้งหมด'], ...types].map(([id, label]) => `<button class="filter${state.filter === id ? ' active' : ''}" data-filter="${safe(id)}" aria-pressed="${state.filter === id}">${safe(label)}</button>`).join('')}</div>` : ''}</div><p class="small-text list-context">ทุกบิลทีมตรวจตัวตนและบิลแล้ว · ค้างไม่เกิน 1 เดือน · เริ่มที่ ฿20</p><div id="bills-results" class="bill-list browse-list" aria-live="polite">${browseCards()}</div>` : noBills()}</section>`;
  }
  function browseCards() {
    const search = state.search.trim().toLocaleLowerCase('th');
    const shown = bills.filter(b => (state.filter === 'all' || state.filter === b.type) && (!search || `${b.title} ${b.label} ${b.alias} ${b.region}`.toLocaleLowerCase('th').includes(search)));
    shown.sort((a, b) => Number(isOpen(b)) - Number(isOpen(a)));
    return shown.length ? shown.map(billCard).join('') : `<div class="empty-state">${icon('search')}<h2>ยังไม่พบบิลที่ค้นหา</h2><p>ลองใช้คำสั้น ๆ หรือเลือกดูทุกประเภท</p><button class="button soft" data-clear-search>ดูบิลทั้งหมด</button></div>`;
  }
  function howItWorks() {
    return `<ol class="pay-steps"><li><b>เลือกยอดที่สบายใจ</b><span>เริ่มที่ ฿20 ไม่เกินยอดที่ยังขาด</span></li><li><b>โอนเข้าพร้อมเพย์ของผู้ขอ</b><span>สแกน QR ได้ทุกธนาคาร ชื่อบัญชีตรงกับที่ทีมตรวจตัวตนแล้ว</span></li><li><b>ครบยอดแล้ว ผู้ขอนำไปจ่ายบิล</b><span>และส่งใบเสร็จให้ทีมตรวจภายใน ${RECEIPT_DAYS} วัน</span></li></ol>`;
  }
  function detail(b) {
    const open = isOpen(b);
    const action = open ? `<button class="button coral full" data-start-help="${b.id}">ช่วยอีกนิด เริ่ม ฿20 ${icon('heart')}</button>` : `<div class="support-note">${icon(b.status === 'paid' ? 'check' : 'clock')}<p><b>${b.status === 'paid' ? 'บิลนี้จ่ายแล้ว ขอบคุณทุกแรงช่วย' : b.status === 'closed' || tooOverdue(b) ? 'บิลนี้ปิดรับแล้ว' : `ครบยอดแล้ว ผู้ขอกำลังนำไปจ่ายบิล`}</b><br>ไม่ต้องโอนเพิ่มสำหรับบิลนี้</p></div>`;
    return `<section class="view detail-view"><div class="view-header">${backButton('#/bills', 'บิลที่รอเรา')}<div class="header-actions"><button class="icon-button" data-share="${b.id}" aria-label="บอกต่อบิลนี้">${icon('megaphone')}</button>${saveButton(b)}</div></div>
      <div class="detail-layout"><div class="detail-main"><div class="detail-title"><span class="category-label">${safe(b.label)}</span><h1 class="view-title" tabindex="-1">${safe(b.title)}</h1><p class="bill-meta">โดย ${safe(b.alias)}</p><p class="bill-meta">${b.region ? `${icon('pin')} ${safe(b.region)} ` : ''}${statusPill(b)}</p></div>
      <div class="detail-progress">${balance(b, open ? dueText(b) : '')}</div>
      <section class="story-section"><h2>รายละเอียด</h2><p>${safe(b.story)}</p></section>
      <section class="story-section"><h2>ช่วยยังไง</h2>${howItWorks()}<button class="text-link" data-help>เราดูแลความไว้ใจอย่างไร ${icon('chevron')}</button></section>
      <p class="small-text">เห็นอะไรผิดปกติในบิลนี้? <a class="text-link inline-link" href="${contactLink('report', b)}">แจ้งทีม</a></p></div>
      <aside class="detail-aside"><div class="form-card">${balance(b, open ? dueText(b) : '')}${b.dueDate ? `<p class="bill-meta">กำหนดชำระตามบิล ${dueDate(b)}</p>` : ''}${action}<p class="small-text centered">เงินเข้าพร้อมเพย์ของผู้ขอโดยตรง</p></div></aside></div>
      <div class="mobile-helpbar"><button class="button outline" data-share="${b.id}">บอกต่อคนละนิด</button>${open ? `<button class="button coral" data-start-help="${b.id}">ช่วยอีกนิด ${icon('heart')}</button>` : `${statusPill(b)}`}</div></section>`;
  }
  function amountError(b, value) {
    const gap = missing(b), min = Math.min(20, gap);
    // Whole baht, except the last helper may send the exact remainder (bills can end in satang).
    if (!Number.isFinite(value) || (!Number.isInteger(value) && value !== gap)) return 'กรอกจำนวนเงินเป็นบาทเต็มจำนวน';
    if (value < min) return `เริ่มที่ ${money(min)} เลือกตามกำลังที่สะดวกได้`;
    if (value > gap) return `ยอดที่ยังขาดคือ ${money(gap)} ช่วยไม่เกินยอดนี้นะ`;
    return '';
  }
  function help(b, error = '') {
    if (!isOpen(b)) return closedView(b);
    const amount = state.amounts[b.id] ?? Math.min(20, missing(b));
    const preset = [20, 50, 100].includes(amount);
    return `<section class="view help-view">${topbar(safe(b.title), {back:`#/bill/${b.id}`})}<div class="help-layout"><div class="help-summary">${categoryIcon(b)}<p class="bill-meta">โดย ${safe(b.alias)} · ขาดอีก ${money(missing(b))}</p></div><div class="help-form form-card"><h2>วันนี้อยากช่วยเท่าไร</h2><form id="help-form" data-bill="${b.id}" novalidate><div class="amount-options" role="group" aria-label="เลือกจำนวนเงิน">${[20, 50, 100].map(n => `<button class="amount-option${amount === n ? ' selected' : ''}" type="button" data-amount="${n}" ${n > missing(b) ? 'disabled' : ''} aria-pressed="${amount === n}">${money(n)}</button>`).join('')}</div><div class="form-field"><label class="field-label" for="custom-amount">หรือระบุจำนวนเอง</label><div class="amount-input"><input class="input" id="custom-amount" name="amount" type="number" inputmode="decimal" min="${Math.min(20, missing(b))}" max="${missing(b)}" step="any" value="${preset ? '' : amount}" placeholder="ระบุจำนวนอื่น" autocomplete="off" aria-describedby="amount-error" ${error ? 'aria-invalid="true"' : ''}><span aria-hidden="true">฿</span></div><p id="amount-error" class="field-error" role="alert">${error}</p></div><button type="submit" class="button coral full">ไปหน้าโอนเงิน ${icon('arrow')}</button></form><div class="support-note">${icon('lock')}<p>เงินโอนเข้าพร้อมเพย์ของผู้ขอโดยตรง<br>ชื่อบัญชีตรงกับที่ทีมตรวจตัวตนแล้ว</p></div></div></div></section>`;
  }
  function pay(b) {
    if (!isOpen(b)) return closedView(b);
    const amount = state.amounts[b.id];
    if (!amount || amountError(b, amount)) return help(b, amount ? amountError(b, amount) : '');
    const p = b.pay, name = safe(p.accountName || 'ชื่อผู้ขอ'), image = typeof window.qrcode === 'function' ? promptPayImage(b, amount) : '';
    const manual = `<div class="summary-box"><div class="summary-row pay-ref"><span>พร้อมเพย์</span><b>${maskPromptPay(p.promptpay)} <button class="icon-button small-icon" data-copy="${digits(p.promptpay)}" aria-label="คัดลอกเลขพร้อมเพย์">${icon('copy')}</button></b></div><div class="summary-row"><span>ชื่อบัญชี</span><b>${name}</b></div><div class="summary-row total"><span>ยอดที่คุณช่วย</span><b>${money(amount)}</b></div></div><p class="small-text">เปิดแอปธนาคาร เลือกโอนเงินพร้อมเพย์ วางเลขที่คัดลอกไว้ แล้วใส่ยอด ${money(amount)}</p>`;
    return `<section class="view review-view pay-qr-view">${topbar(`โอน ${money(amount)} ให้ผู้ขอ`, {back:`#/help/${b.id}`})}<div class="help-layout"><div class="help-form form-card">
      ${image ? `<figure class="pay-qr-card"><img class="pay-qr" src="${image}" alt="QR พร้อมเพย์ ยอด ${money(amount)} สำหรับ${safe(b.title)}"><figcaption>${safe(b.title)}</figcaption></figure>
      <a class="button primary full" href="${image}" download="konlanid-${safe(b.id)}-${Number(amount).toFixed(2)}.png">${icon('download')} บันทึก QR</a>
      <ol class="pay-steps qr-steps"><li><b>บันทึก QR ลงเครื่อง</b><span>บันทึกไม่ได้? กดค้างที่รูปแล้วเลือกบันทึกรูป</span></li><li><b>เปิดแอปธนาคาร แล้วกดสแกน</b><span>เลือกรูป QR จากอัลบั้ม แอปจะใส่ยอดให้เอง</span></li><li><b>ตรวจชื่อบัญชีให้เป็น “${name}”</b><span>และยอด ${money(amount)} แล้วกดยืนยัน เก็บสลิปไว้</span></li></ol>
      <p class="small-text desktop-only">อยู่บนคอมพิวเตอร์? ใช้แอปธนาคารในมือถือสแกนจากจอได้เลย</p>
      <details class="faq"><summary>สแกนไม่ได้? โอนด้วยเลขพร้อมเพย์ ${icon('chevron')}</summary>${manual}</details>` : manual}
      <div class="support-note warm">${icon('info')}<p>ถ้าชื่อบัญชีในแอปไม่ตรงกับ “${name}” อย่าเพิ่งโอน <a class="text-link inline-link" href="${contactLink('report', b)}">แจ้งทีม</a></p></div>
      <button class="button coral full" data-paid="${b.id}">โอนแล้ว ${icon('check')}</button>
      <p class="small-text centered">ยอดบนหน้าเว็บจะอัปเดตเมื่อผู้ขอยืนยันว่าเงินเข้าแล้ว</p></div></div></section>`;
  }
  function closedView(b) {
    return `<section class="view">${topbar('บิลนี้ไม่ต้องช่วยเพิ่มแล้ว', {back:`#/bill/${b.id}`})}<div class="empty-state">${icon(b.status === 'paid' ? 'check' : 'clock')}<h2>${b.status === 'paid' ? 'จ่ายบิลแล้ว ขอบคุณทุกแรงช่วย' : 'ครบยอดหรือปิดรับแล้ว'}</h2><p>ลองดูบิลอื่นที่ยังรอเราอยู่ได้เลย</p><a class="button primary" href="#/bills">ดูบิลที่รอเรา</a></div></section>`;
  }
  function thanks(b) {
    const pledge = [...state.pledges].reverse().find(p => p.billId === b.id);
    return `<section class="view success-view"><div class="success-layout"><div class="success-content"><div class="success-check">${icon('check')}</div><h1 class="view-title success-title" tabindex="-1">ขอบคุณที่ช่วย<br>คนละนิดนะ</h1><p class="success-description">${pledge ? `แรงช่วย ${money(pledge.amount)} ของคุณ` : 'แรงช่วยเล็ก ๆ ของคุณ'}<br>มีความหมายมากจริง ๆ</p><a class="button primary full" href="${contactLink('paid', b, pledge && pledge.amount)}">แจ้งทีมว่าโอนแล้ว ${icon('arrow')}</a><a class="button outline full" href="#/bill/${b.id}">ดูความคืบหน้าบิลนี้</a><a class="back-home" href="#/">กลับหน้าหลัก</a></div><img class="success-art" src="assets/woman-heart.webp" width="650" height="650" alt="ภาพวาดผู้หญิงกอดหัวใจด้วยรอยยิ้ม"></div></section>`;
  }
  function timeline(b) {
    const step = b.status === 'paid' ? 2 : missing(b) ? 0 : 1;
    const items = [['เปิดรับแรงช่วย', `ช่วยแล้ว ${money(b.raised)} จาก ${money(b.goal)}`], ['ครบยอด', `ผู้ขอนำไปจ่ายบิล และส่งใบเสร็จภายใน ${RECEIPT_DAYS} วัน`], ['จ่ายบิลแล้ว', 'ทีมตรวจใบเสร็จแล้ว']];
    return `<ol class="timeline">${items.map(([title, desc], i) => `<li class="timeline-item${i <= step ? ' done' : ''}"><span class="timeline-dot">${i < step ? icon('check') : i + 1}</span><div><b>${title}</b><p>${desc}</p></div></li>`).join('')}</ol>`;
  }
  function activity() {
    const total = state.pledges.reduce((n, p) => n + p.amount, 0), anyOpen = bills.some(isOpen);
    const mine = [...new Set(state.pledges.map(p => p.billId))].map(getBill).filter(Boolean);
    const empty = `<div class="empty-state soft-empty">${icon('users')}<h2>รอยต่อแรก เริ่มได้จากนิดเดียว</h2><p>เมื่อคุณช่วยบิลไหน ความคืบหน้าของบิลนั้นจะมาอยู่ตรงนี้</p>${anyOpen ? `<a class="button primary" href="#/bills">เลือกบิลที่อยากช่วย ${icon('arrow')}</a>` : `<button class="button soft" data-share>บอกต่อคนละนิด ${icon('megaphone')}</button>`}</div>`;
    return `<section class="view activity-view">${topbar('รวมกันคนละนิด')}${state.pledges.length ? `<div class="activity-summary"><span class="category-icon water">${icon('leaf')}</span><div><p class="muted">ที่คุณช่วยจากเครื่องนี้</p><h2>${money(total)} <span class="small-text">จาก ${state.pledges.length} ครั้ง</span></h2></div></div>` : ''}<div class="activity-list">${mine.length ? mine.map(b => `<article class="activity-card"><div class="section-label"><div><span class="category-label">${safe(b.label)}</span><h2>${safe(b.title)}</h2></div><b class="activity-amount">${money(state.pledges.filter(p => p.billId === b.id).reduce((n, p) => n + p.amount, 0))}</b></div>${timeline(b)}<a class="text-link" href="#/bill/${b.id}">ดูบิลและยอดล่าสุด ${icon('chevron')}</a></article>`).join('') : empty}</div></section>`;
  }
  function profile() {
    const total = state.pledges.reduce((n, p) => n + p.amount, 0), unique = new Set(state.pledges.map(p => p.billId)).size;
    return `<section class="view profile-view">${topbar('พื้นที่ของฉัน')}<div class="profile-layout"><div><div class="profile-card"><div class="profile-avatar">${icon('user')}</div><h2>เพื่อนคนละนิด</h2><p class="muted">วันนี้เป็นผู้ให้ วันหน้าอาจเป็นผู้รับ</p>${state.pledges.length ? `<div class="profile-stats"><div><b>${state.pledges.length}</b><span>ครั้งที่ช่วย</span></div><div><b>${unique}</b><span>บิลที่ช่วย</span></div><div><b>${money(total)}</b><span>ยอดที่ช่วย</span></div></div><p class="small-text">นับจากที่คุณกด “โอนแล้ว” บนเครื่องนี้ ไม่ต้องสมัครสมาชิก</p>` : ''}</div></div><div class="profile-menu"><a href="#/activity">${icon('users')}<span>รวมกันคนละนิด</span>${icon('chevron')}</a><button data-favorites>${icon('bookmark')}<span>บิลที่เก็บไว้ <small>(${state.favorites.size})</small></span>${icon('chevron')}</button><a href="#/request">${icon('send')}<span>ส่งต่อคนละนิด</span>${icon('chevron')}</a><button data-help>${icon('shield')}<span>ความไว้ใจและความเป็นส่วนตัว</span>${icon('chevron')}</button><a href="${contactLink('question')}">${icon('chat')}<span>ติดต่อทีมคนละนิด</span>${icon('chevron')}</a></div></div></section>`;
  }
  function requestView() {
    return `<section class="view request-view">${topbar('ส่งต่อคนละนิด')}<div class="request-layout"><div class="request-intro"><span class="category-icon electricity">${icon('send')}</span><h2>วันนี้รับแรงช่วย<br>วันหน้าอาจส่งต่อ</h2><p>ถ้าคุณหรือคนที่คุณรู้จักกำลังติดขัดเรื่องบิลจำเป็น ส่งเรื่องมาให้ทีมได้ ไม่ต้องเปิดหน้า และไม่ต้องคืนเงินให้ผู้ช่วย</p></div><div class="form-card request-card"><h2>เปิดรับบิลอย่างไร</h2><ul class="pay-how"><li>ทีมตรวจตัวตนของผู้ขอด้วยบัตรประชาชนและรูปถ่ายคู่บัตร</li><li>บิลรอบล่าสุดในชื่อของผู้ขอ ค้างชำระไม่เกิน 1 เดือน</li><li>พร้อมเพย์ในชื่อของผู้ขอเอง แนะนำให้ใช้เบอร์มือถือ</li><li>ครบยอดแล้ว นำไปจ่ายบิล และส่งใบเสร็จให้ทีมภายใน ${RECEIPT_DAYS} วัน</li></ul><div class="support-note">${icon('shield')}<p>หน้าเว็บแสดงชื่อเรียกที่คุณเลือกเอง จังหวัด และยอดบิล ตอนคนช่วยโอน แอปธนาคารจะแสดงชื่อบัญชีพร้อมเพย์ของคุณ เพื่อให้เขาตรวจได้ว่าโอนถูกคน</p></div><a class="button outline full" href="/draft-story">ร่างเรื่องราวด้วย AI ${icon('file')}</a><a class="button primary full" href="${contactLink('ask_help')}">ส่งเรื่องขอความช่วยเหลือ ${icon('arrow')}</a><a class="button outline full" href="${contactLink('refer')}">แนะนำคนที่ต้องการความช่วยเหลือ</a><p class="small-text">ระบบสมัครและยืนยันตัวตนออนไลน์กำลังจะเปิด ระหว่างนี้ทีมจะติดต่อกลับตามช่องทางที่คุณให้ไว้</p></div></div></section>`;
  }
  const TOPICS = [['ask_help', 'ขอความช่วยเหลือเรื่องบิล'], ['refer', 'แนะนำคนที่ต้องการความช่วยเหลือ'], ['report', 'แจ้งเรื่องผิดปกติ'], ['paid', 'แจ้งว่าโอนแล้ว'], ['question', 'สอบถามเรื่องอื่น ๆ']];
  const needsContact = topic => ['ask_help', 'refer', 'question'].includes(topic);
  function contactView() {
    const q = params(), topic = TOPICS.some(([id]) => id === q.get('topic')) ? q.get('topic') : 'question';
    const b = getBill(q.get('bill') || ''), amount = Number(q.get('amount')) > 0 ? Number(q.get('amount')) : null;
    const back = b ? `#/bill/${b.id}` : topic === 'ask_help' || topic === 'refer' ? '#/request' : '#/me';
    const hint = {ask_help:'เล่าสั้น ๆ ว่าเป็นบิลอะไร ยอดเท่าไร และตอนนี้ติดขัดเรื่องอะไร เท่าที่สบายใจ', refer:'เล่าสั้น ๆ ว่าเขาติดขัดเรื่องบิลอะไร และเขารู้ว่าคุณส่งเรื่องมาหรือยัง', report:'เห็นอะไรผิดปกติ เช่น ชื่อบัญชีตอนโอนไม่ตรง มีคนส่ง QR อื่นมาให้นอกเว็บ หรือบิลนี้จ่ายไปแล้ว', paid:'บอกเวลาที่โอน และชื่อที่ใช้โอน ทีมจะยืนยันกับผู้ขอให้', question:'อยากถามหรือบอกอะไรทีมคนละนิด'}[topic];
    return `<section class="view contact-view">${topbar('ติดต่อทีมคนละนิด', {back})}<div class="help-layout"><div class="help-form form-card"><form id="contact-form" novalidate>
      <div class="form-field"><label class="field-label" for="contact-topic">เรื่องที่ติดต่อ</label><select class="input" id="contact-topic" name="topic">${TOPICS.map(([id, label]) => `<option value="${id}"${id === topic ? ' selected' : ''}>${label}</option>`).join('')}</select></div>
      ${b ? `<p class="contact-bill">${categoryIcon(b)}<span>เกี่ยวกับบิล <b>${safe(b.title)}</b>${amount ? ` · ${money(amount)}` : ''}</span></p><input type="hidden" name="bill" value="${safe(b.id)}">${amount ? `<input type="hidden" name="amount" value="${amount}">` : ''}` : ''}
      <div class="form-field"><label class="field-label" for="contact-message">ข้อความ</label><textarea class="input" id="contact-message" name="message" rows="5" maxlength="2000" required aria-describedby="contact-message-hint contact-message-error">${topic === 'paid' && amount ? `โอนแล้ว ${money(amount)} ` : ''}</textarea><p id="contact-message-hint" class="small-text">${hint}</p><p id="contact-message-error" class="field-error" role="alert"></p></div>
      <div class="form-field"><label class="field-label" for="contact-name">ชื่อเรียก <span class="muted">(ไม่บังคับ)</span></label><input class="input" id="contact-name" name="name" maxlength="80" autocomplete="nickname"></div>
      <div class="form-field"><label class="field-label" for="contact-reply">ช่องทางให้ทีมติดต่อกลับ <span class="muted" id="contact-reply-optional">${needsContact(topic) ? '' : '(ไม่บังคับ)'}</span></label><input class="input" id="contact-reply" name="reply" maxlength="120" placeholder="LINE ID เบอร์โทร หรืออีเมล" aria-describedby="contact-reply-error"><p id="contact-reply-error" class="field-error" role="alert"></p></div>
      <div class="hp-field" aria-hidden="true"><label for="contact-website">เว็บไซต์</label><input id="contact-website" name="website" tabindex="-1" autocomplete="off"></div>
      <label class="checkbox-label"><input type="checkbox" id="contact-consent" name="consent" aria-describedby="contact-consent-error"> ยินยอมให้ทีมคนละนิดเก็บข้อความนี้ไว้เพื่อติดต่อกลับและดูแลบิล</label><p id="contact-consent-error" class="field-error" role="alert"></p>
      <div class="support-note warm">${icon('lock')}<p>อย่าส่งเลขบัตรประชาชน รหัสผ่าน หรือรหัส OTP ในข้อความ ทีมจะขอเอกสารที่จำเป็นผ่านช่องทางที่ปลอดภัย</p></div>
      <p id="contact-send-error" class="field-error" role="alert"></p>
      <button type="submit" class="button coral full" id="contact-submit">ส่งข้อความ ${icon('send')}</button>
    </form></div></div></section>`;
  }
  function contactSent() {
    return `<section class="view success-view">${topbar('ส่งข้อความแล้ว', {back:'#/'})}<div class="empty-state soft-empty">${icon('check')}<h2>ทีมได้รับข้อความแล้ว</h2><p>ขอบคุณที่ส่งมานะ ถ้าให้ช่องทางติดต่อไว้ ทีมจะติดต่อกลับเร็วที่สุด</p><a class="button primary" href="#/">กลับหน้าหลัก</a></div></section>`;
  }
  async function sendContact(form) {
    const f = new FormData(form), topic = String(f.get('topic') || 'question');
    const message = String(f.get('message') || '').trim(), reply = String(f.get('reply') || '').trim();
    const errors = {
      'contact-message': message.length < 5 ? 'เขียนข้อความอย่างน้อยสั้น ๆ สักประโยคนะ' : '',
      'contact-reply': needsContact(topic) && !reply ? 'ใส่ช่องทางให้ทีมติดต่อกลับ เช่น LINE ID หรือเบอร์โทร' : '',
      'contact-consent': !f.get('consent') ? 'กรุณากดยินยอมก่อนส่งข้อความ' : ''
    };
    let first = null;
    for (const [id, msg] of Object.entries(errors)) {
      const err = form.querySelector(`#${id}-error`), input = form.querySelector(`#${id}`);
      err.textContent = msg; input.setAttribute('aria-invalid', String(!!msg));
      if (msg && !first) first = input;
    }
    if (first) {first.focus(); return;}
    if (String(f.get('website') || '')) {go('/contact-sent'); return;}
    const sendError = form.querySelector('#contact-send-error'), button = form.querySelector('#contact-submit');
    if (!backend) {sendError.textContent = 'ตอนนี้ยังส่งข้อความไม่ได้ ทีมกำลังเปิดระบบ ลองใหม่อีกครั้งภายหลังนะ'; return;}
    if (state.sending) return;
    state.sending = true; button.disabled = true; sendError.textContent = '';
    const row = {topic, message, display_name: String(f.get('name') || '').trim() || null, contact: reply || null, bill_id: f.get('bill') || null, amount: f.get('amount') ? Number(f.get('amount')) : null, consent: true};
    const headers = {'Content-Type': 'application/json', apikey: backend.key, Prefer: 'return=minimal'};
    if (!backend.key.startsWith('sb_')) headers.Authorization = `Bearer ${backend.key}`;
    try {
      const res = await fetch(`${backend.url}/rest/v1/contact_messages`, {method: 'POST', headers, body: JSON.stringify(row)});
      if (!res.ok) throw new Error(String(res.status));
      go('/contact-sent');
    } catch {
      sendError.textContent = 'ส่งไม่สำเร็จ ลองกดส่งอีกครั้งนะ ข้อความที่เขียนไว้ยังอยู่';
      button.disabled = false;
    } finally {state.sending = false;}
  }
  function openSupport(html, title = 'คนละนิด · ความไว้ใจ') {
    if (!dialog || !support) return;
    if (!dialog.open) lastFocus = document.activeElement;
    support.innerHTML = html; dialog.setAttribute('aria-label', title);
    if (!dialog.open) dialog.showModal(); dialog.scrollTop = 0;
    const heading = support.querySelector('h2'); if (heading) {heading.tabIndex = -1; heading.focus({preventScroll:true});}
    hydrateIcons(support);
  }
  function closeSupport() {if (dialog?.open) dialog.close();}
  function trustModal() {
    openSupport(`<div class="modal-body"><h2 class="modal-title">ช่วยกันอย่างไว้ใจได้</h2><div class="trust-checks"><div class="trust-item">${icon('user')}<div><b>ทีมตรวจตัวตนผู้ขอ</b><span>ด้วยบัตรประชาชนและรูปถ่ายคู่บัตร ก่อนเปิดรับบิล</span></div></div><div class="trust-item">${icon('file')}<div><b>ตรวจบิลรอบล่าสุดในชื่อผู้ขอ</b><span>ค้างไม่เกิน 1 เดือน ค้างนานกว่านั้นระบบปิดรับเอง</span></div></div><div class="trust-item">${icon('lock')}<div><b>เงินเข้าพร้อมเพย์ของผู้ขอโดยตรง</b><span>ชื่อบัญชีต้องตรงกับชื่อที่ทีมตรวจแล้ว ตรวจได้ในแอปธนาคารก่อนกดยืนยัน</span></div></div><div class="trust-item">${icon('check')}<div><b>ครบยอดแล้วต้องส่งใบเสร็จ</b><span>ผู้ขอส่งใบเสร็จให้ทีมตรวจภายใน ${RECEIPT_DAYS} วัน แล้วบิลจะขึ้นว่าจ่ายแล้ว</span></div></div></div><details class="faq"><summary>ยอดบนหน้าเว็บอัปเดตเมื่อไร ${icon('chevron')}</summary><p>เมื่อผู้ขอยืนยันว่าเงินเข้าแล้ว จึงอาจช้ากว่าเวลาที่คุณโอนเล็กน้อย ดูยอดที่ยังขาดก่อนโอนทุกครั้ง เมื่อครบยอดแล้วจะปิดรับทันที</p></details><details class="faq"><summary>ข้อมูลส่วนตัวของผู้ขอ ${icon('chevron')}</summary><p>หน้าเว็บแสดงชื่อเรียกที่ผู้ขอเลือกเอง จังหวัด และยอดบิล ไม่แสดงชื่อตามบัตรหรือที่อยู่ ตอนโอน แอปธนาคารจะแสดงชื่อบัญชีพร้อมเพย์ เพื่อให้คุณตรวจได้ว่าโอนถูกคน</p></details><details class="faq"><summary>ถ้าเห็นอะไรผิดปกติ ${icon('chevron')}</summary><p>แจ้งทีมได้ทุกเมื่อ ทีมจะพักบิลไว้ระหว่างตรวจ และไม่เปิดเผยชื่อผู้แจ้ง</p><a class="button outline full" href="${contactLink('report')}" data-close-on-nav>แจ้งทีม</a></details><button class="button primary full" data-close>เข้าใจแล้ว</button></div>`);
  }
  function favoritesModal() {
    const list = bills.filter(b => state.favorites.has(b.id));
    openSupport(`<div class="modal-body"><h2 class="modal-title">บิลที่เก็บไว้</h2>${list.length ? `<div class="saved-list">${list.map(b => `<a class="saved-item" href="#/bill/${b.id}" data-close-on-nav>${categoryIcon(b)}<span><b>${safe(b.title)}</b><small>ขาดอีก ${money(missing(b))}</small></span>${icon('chevron')}</a>`).join('')}</div>` : `<div class="empty-state">${icon('bookmark')}<p>แตะไอคอนเก็บบนบิลที่อยากกลับมาดู<br>บิลนั้นจะมาอยู่ตรงนี้</p></div>`}<button class="button outline full" data-close>ปิด</button></div>`, 'บิลที่เก็บไว้');
  }
  function render({focus = true, restore = false} = {}) {
    const path = route(), segments = path.split('/').filter(Boolean); let html = '', active = 'home';
    if (path === '/') html = home();
    else if (path === '/bills') {html = browse(); active = 'browse';}
    else if (path === '/activity') {html = activity(); active = 'activity';}
    else if (path === '/me') {html = profile(); active = 'profile';}
    else if (path === '/request') {html = requestView(); active = '';}
    else if (path === '/contact') {html = contactView(); active = '';}
    else if (path === '/contact-sent') {html = contactSent(); active = '';}
    else if (['bill', 'help', 'pay', 'thanks'].includes(segments[0]) && segments.length === 2) {
      const b = getBill(segments[1]); active = 'browse';
      if (b) html = ({bill:detail, help, pay, thanks}[segments[0]])(b);
    }
    if (!html) html = `<section class="view">${topbar('ไม่พบหน้านี้')}<div class="empty-state">${icon('file')}<p>บิลนี้อาจปิดไปแล้ว ลองเลือกบิลอื่นที่ยังรอเราอยู่</p><a class="button primary" href="#/bills">ไปที่บิลที่รอเรา</a></div></section>`;
    app.innerHTML = html; app.dataset.view = segments[0] || 'home'; document.body.dataset.route = segments[0] || 'home';
    document.querySelectorAll('[data-nav]').forEach(el => {const on = el.dataset.nav === active; el.classList.toggle('active', on); if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');});
    hydrateIcons();
    const heading = app.querySelector('h1'); if (focus && heading) heading.focus({preventScroll:true});
    if (restore) window.scrollTo({top:scrollPositions.get(location.hash) || 0, behavior:'instant'});
    currentHash = location.hash;
  }
  function updateAmountForm(showError = true) {
    const form = document.querySelector('#help-form'); if (!form) return false;
    const b = getBill(form.dataset.bill), input = form.querySelector('#custom-amount');
    const value = input.value === '' ? (state.amounts[b.id] ?? NaN) : Number(input.value), error = amountError(b, value);
    if (!error) state.amounts[b.id] = value;
    if (showError) {form.querySelector('#amount-error').textContent = error; input.setAttribute('aria-invalid', String(!!error));}
    form.querySelectorAll('[data-amount]').forEach(el => {const on = Number(el.dataset.amount) === value; el.classList.toggle('selected', on); el.setAttribute('aria-pressed', String(on));});
    return !error;
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button,a'); if (!target) return;
    if (target.matches('[data-close]')) {event.preventDefault(); closeSupport(); return;}
    if (target.matches('[data-close-on-nav]')) closeSupport();
    if (target.matches('[data-help]')) {event.preventDefault(); trustModal(); return;}
    if (target.matches('[data-share]')) {shareLink(getBill(target.dataset.share)); return;}
    if (target.matches('[data-copy]')) {copyText(target.dataset.copy, 'คัดลอกเลขพร้อมเพย์แล้ว ไปวางในแอปธนาคารได้เลย'); return;}
    if (target.matches('[data-favorites]')) {favoritesModal(); return;}
    if (target.matches('[data-filter]')) {
      state.filter = target.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(el => {const on = el === target; el.classList.toggle('active', on); el.setAttribute('aria-pressed', String(on));});
      document.querySelector('#bills-results').innerHTML = browseCards(); hydrateIcons(); return;
    }
    if (target.matches('[data-clear-search]')) {state.search = ''; state.filter = 'all'; render({focus:false}); document.querySelector('#bill-search')?.focus(); return;}
    if (target.matches('[data-save]')) {
      const id = target.dataset.save; state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); persist();
      document.querySelectorAll(`[data-save="${id}"]`).forEach(el => {const on = state.favorites.has(id); el.classList.toggle('is-saved', on); el.setAttribute('aria-pressed', String(on));});
      toast(state.favorites.has(id) ? 'เก็บบิลนี้ไว้กลับมาดูแล้ว' : 'ยกเลิกเก็บบิลแล้ว'); return;
    }
    if (target.matches('[data-start-help]')) {const b = getBill(target.dataset.startHelp); if (b) go(isOpen(b) ? `/help/${b.id}` : `/bill/${b.id}`); return;}
    if (target.matches('[data-amount]')) {const form = document.querySelector('#help-form'); form.querySelector('#custom-amount').value = ''; state.amounts[form.dataset.bill] = Number(target.dataset.amount); updateAmountForm(); return;}
    if (target.matches('[data-paid]')) {
      const b = getBill(target.dataset.paid), amount = b && state.amounts[b.id]; if (!b || !amount) return;
      state.pledges.push({billId:b.id, amount, at:new Date().toISOString()}); persist(); delete state.amounts[b.id];
      go(`/thanks/${b.id}`); return;
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'bill-search') {state.search = event.target.value; document.querySelector('#bills-results').innerHTML = browseCards(); hydrateIcons(); return;}
    if (event.target.id === 'custom-amount') updateAmountForm(false);
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'contact-topic') {const opt = document.querySelector('#contact-reply-optional'); if (opt) opt.textContent = needsContact(event.target.value) ? '' : '(ไม่บังคับ)';}
  });
  document.addEventListener('focusout', event => {if (event.target.id === 'custom-amount' && event.target.value !== '') updateAmountForm(true);});
  document.addEventListener('submit', event => {
    if (event.target.id === 'help-form') {
      event.preventDefault(); const b = getBill(event.target.dataset.bill);
      if (!updateAmountForm(true)) {document.querySelector('#custom-amount').focus(); return;}
      go(`/pay/${b.id}`);
    }
    if (event.target.id === 'contact-form') {event.preventDefault(); sendContact(event.target);}
  });
  if (dialog) {
    dialog.addEventListener('click', event => {if (event.target === dialog) {const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeSupport();}});
    dialog.addEventListener('close', () => {if (lastFocus && document.contains(lastFocus)) lastFocus.focus({preventScroll:true}); else app.querySelector('h1')?.focus({preventScroll:true});});
  }
  window.addEventListener('hashchange', () => {
    if (currentHash) scrollPositions.set(currentHash, window.scrollY);
    closeSupport(); render({restore:true});
  });
  if (app) {hydrateIcons(); render({focus:false});}
})();
