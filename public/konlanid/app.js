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
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-5.6A8 8 0 1 1 21 12Z"/><path d="M8 11h8M8 14.5h5"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/>',
    megaphone: '<path d="M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M17 8a5 5 0 0 1 0 8M7 15l1.5 5h3L10 16"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1.5A5.5 5.5 0 0 1 7.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 4 5v2"/>'
  };
  const icon = (name, extra = '') => `<svg class="${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  const money = n => `฿${Number(n).toLocaleString('en-US')}`;
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const typeIcon = {electricity:'bolt', water:'drop', car:'car', credit:'card'};

  // Bills and the contact channel come from data.js, which the team edits by hand.
  const config = window.KONLANID || {};
  const contact = config.contact && config.contact.url ? config.contact : null;
  const bills = (config.bills || []).filter(b => b && b.id && b.title && b.goal > 0).map(b => ({raised:0, helpers:0, status:'open', pay:{}, ...b}));

  // What this browser has pledged. Kept on this device only; the public totals come from data.js.
  const STORE = 'konlanid:v1';
  const load = () => {try {return JSON.parse(localStorage.getItem(STORE)) || {};} catch {return {};}};
  const saved = load();
  const state = {
    pledges: Array.isArray(saved.pledges) ? saved.pledges : [],
    favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites : []),
    amounts: {}, filter: 'all', search: ''
  };
  const persist = () => {try {localStorage.setItem(STORE, JSON.stringify({pledges:state.pledges, favorites:[...state.favorites]}));} catch {}};

  const app = document.querySelector('#app');
  const dialog = document.querySelector('#support-dialog');
  const support = document.querySelector('#support-content');
  const scrollPositions = new Map();
  let currentHash = '', lastFocus = null, toastTimer;
  const getBill = id => bills.find(b => b.id === id);
  const missing = b => Math.max(0, b.goal - b.raised);
  const isOpen = b => b.status === 'open' && missing(b) > 0;
  const route = () => (location.hash.slice(1) || '/').split('?')[0];
  const dueText = b => {
    if (!b.dueDate) return '';
    const due = new Date(`${b.dueDate}T23:59:59+07:00`);
    if (Number.isNaN(due.getTime())) return '';
    const days = Math.ceil((due - Date.now()) / 86400000);
    return days > 0 ? `เหลืออีก ${days} วัน` : 'ถึงกำหนดชำระแล้ว';
  };
  const dueDate = b => {
    const d = new Date(`${b.dueDate}T12:00:00+07:00`);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'numeric'});
  };

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
    const text = bill ? `ช่วยกันคนละนิด ${bill.title} ยังขาดอีก ${money(missing(bill))}` : 'ไม่ต้องมีมาก แค่ช่วยกันคนละนิด ก็แบ่งเบาบิลของใครอีกคนได้';
    try {
      if (navigator.share) {await navigator.share({title:'คนละนิด', text, url}); return;}
      await navigator.clipboard.writeText(`${text} ${url}`); toast('คัดลอกลิงก์แล้ว ส่งต่อให้เพื่อนได้เลย');
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      openSupport(`<div class="modal-body"><h2 class="modal-title">ส่งลิงก์นี้ให้เพื่อนได้เลย</h2><p class="muted">${safe(text)}</p><input class="input" readonly value="${safe(url)}" aria-label="ลิงก์คนละนิด" onfocus="this.select()"><button class="button primary full" data-close>เรียบร้อย</button></div>`, 'บอกต่อคนละนิด');
    }
  }
  function contactButton(label, cls = 'primary') {
    return contact ? `<a class="button ${cls} full" href="${safe(contact.url)}" target="_blank" rel="noopener noreferrer">${icon('chat')} ${label}</a>` : '';
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
    if (b.status === 'paid') return `<span class="status-pill paid">${icon('check')}จ่ายครบแล้ว</span>`;
    if (b.status === 'closed') return `<span class="status-pill paused">${icon('clock')}ปิดรับแล้ว</span>`;
    if (!missing(b)) return `<span class="status-pill pending">${icon('clock')}ครบยอด · รอทีมยืนยัน</span>`;
    return b.verified ? `<span class="status-pill verified">${icon('check')}ทีมตรวจบิลแล้ว</span>` : '';
  }
  function progress(b) {
    return `<div class="progress" role="progressbar" aria-label="ยอดที่ช่วยแล้วของ${safe(b.title)}" aria-valuemin="0" aria-valuemax="${b.goal}" aria-valuenow="${b.raised}"><span style="transform:scaleX(${Math.min(1, b.raised / b.goal)})"></span></div>`;
  }
  function categoryIcon(b) {
    return `<span class="category-icon ${safe(b.type)}">${icon(typeIcon[b.type] || 'file')}</span>`;
  }
  function billCard(b) {
    const gap = missing(b), fav = state.favorites.has(b.id);
    return `<article class="bill-card">
      <div class="bill-card-top">${categoryIcon(b)}<div class="bill-card-heading"><a href="#/bill/${b.id}" class="bill-card-title">${safe(b.title)}</a><p class="bill-meta">โดย ${safe(b.alias)}<br>${safe(b.region)}</p></div><button class="icon-button bill-save${fav ? ' is-saved' : ''}" data-save="${b.id}" aria-pressed="${fav}" aria-label="${fav ? 'ยกเลิกเก็บ' : 'เก็บ'}${safe(b.title)}">${icon('heart')}</button></div>
      <div class="bill-stats"><div><span class="amount-main">${money(gap)}</span><span class="amount-target"> / ${money(b.goal)}</span><p class="bill-meta">ยอดที่ยังขาด / ยอดบิล</p></div><span class="bill-meta">${isOpen(b) ? dueText(b) : ''}</span></div>
      ${progress(b)}
      <div class="bill-card-bottom"><div><p class="bill-meta">ช่วยแล้ว <b>${money(b.raised)}</b> (${b.helpers} คน)</p>${statusPill(b)}</div><a class="button coral bill-card-action" href="#/bill/${b.id}">${isOpen(b) ? 'ช่วยอีกนิด' : 'ดูบิล'} ${icon('arrow')}</a></div>
    </article>`;
  }
  function noBills(text = 'ตอนนี้ยังไม่มีบิลที่เปิดรับ') {
    return `<div class="empty-state soft-empty">${icon('heart')}<h2>${text}</h2><p>ทีมกำลังตรวจบิลก่อนเปิดรับ<br>แวะกลับมาดูใหม่เร็ว ๆ นี้นะ</p><button class="button soft" data-share>บอกต่อคนละนิด ${icon('megaphone')}</button></div>`;
  }
  function home() {
    const open = bills.filter(isOpen);
    return `<section class="view home-view">
      <div class="home-layout"><div class="home-hero"><h1 class="view-title home-title" tabindex="-1">วันนี้<br>ช่วยกันคนละนิดไหม?</h1><p class="home-description">ไม่ต้องมีมาก ไม่ต้องรู้จักกัน<br>แค่คนละนิดก็ช่วยให้ใครอีกคนไปต่อได้</p><img class="home-art" src="assets/helping-hand.webp" width="720" height="480" alt="ภาพวาดมือประคองหัวใจ สื่อถึงการแบ่งปัน" fetchpriority="high"><a class="button primary hero-cta" href="#/bills">ช่วยจ่ายคนละนิด ${icon('arrow')}</a>
      <div class="quick-actions"><a class="quick-action" href="#/bills"><span class="quick-icon pink">${icon('heart')}</span><span>ช่วยจ่าย<br>คนละนิด</span></a><a class="quick-action" href="#/request"><span class="quick-icon yellow">${icon('send')}</span><span>ส่งต่อ<br>คนละนิด</span></a><button class="quick-action" data-share><span class="quick-icon coral">${icon('megaphone')}</span><span>บอกต่อ<br>คนละนิด</span></button><a class="quick-action" href="#/activity"><span class="quick-icon mint">${icon('users')}</span><span>รวมกัน<br>คนละนิด</span></a></div></div>
      <div class="home-bills"><div class="section-label"><h2>บิลที่รอเรา</h2>${open.length ? `<a class="text-link" href="#/bills">ดูทั้งหมด ${icon('chevron')}</a>` : ''}</div>${open.length ? `<div class="bill-list">${open.slice(0, 2).map(billCard).join('')}</div>` : noBills()}</div></div>
      <div class="value-banner"><span class="value-symbol">${icon('leaf')}</span><div><h2>คนละนิด ไม่ใช่จำนวนเงิน</h2><p>แต่คือสิ่งที่เราทำให้กันได้ · ให้เท่าที่ไหว ไม่มีภาระต้องตอบแทน</p></div></div>
    </section>`;
  }
  function browse() {
    const types = [...new Map(bills.map(b => [b.type, b.label])).entries()];
    return `<section class="view browse-view">${topbar('บิลที่รอเรา', {action:`<a class="icon-button" href="#/request" aria-label="ขอความช่วยเหลือ">${icon('plus')}</a>`})}${bills.length ? `<div class="browse-toolbar"><label class="search-field" for="bill-search">${icon('search')}<input class="input" id="bill-search" type="search" placeholder="ค้นหาบิล เช่น ค่าไฟ ค่าน้ำ" value="${safe(state.search)}" autocomplete="off" aria-label="ค้นหาบิล"></label>${types.length > 1 ? `<div class="filters" role="group" aria-label="ประเภทบิล">${[['all', 'ทั้งหมด'], ...types].map(([id, label]) => `<button class="filter${state.filter === id ? ' active' : ''}" data-filter="${safe(id)}" aria-pressed="${state.filter === id}">${safe(label)}</button>`).join('')}</div>` : ''}</div><p class="small-text list-context">ช่วยเท่าที่ไหว เริ่มที่ ฿20</p><div id="bills-results" class="bill-list browse-list" aria-live="polite">${browseCards()}</div>` : noBills()}</section>`;
  }
  function browseCards() {
    const search = state.search.trim().toLocaleLowerCase('th');
    const shown = bills.filter(b => (state.filter === 'all' || state.filter === b.type) && (!search || `${b.title} ${b.label} ${b.alias} ${b.region}`.toLocaleLowerCase('th').includes(search)));
    shown.sort((a, b) => Number(isOpen(b)) - Number(isOpen(a)));
    return shown.length ? shown.map(billCard).join('') : `<div class="empty-state">${icon('search')}<h2>ยังไม่พบบิลที่ค้นหา</h2><p>ลองใช้คำสั้น ๆ หรือเลือกดูทุกประเภท</p><button class="button soft" data-clear-search>ดูบิลทั้งหมด</button></div>`;
  }
  function howItWorks(b) {
    return `<ol class="pay-steps"><li><b>เลือกยอดที่สบายใจ</b><span>เริ่มที่ ฿20 ไม่เกินยอดที่ยังขาด</span></li><li><b>จ่ายตรงเข้าบิล</b><span>ผ่านแอปธนาคารไปที่ ${safe(b.pay.provider || 'ผู้ให้บริการ')} เงินไม่ผ่านบัญชีผู้ขอหรือทีม</span></li><li><b>ส่งสลิปให้ทีม</b><span>ทีมตรวจแล้วอัปเดตยอดบนหน้านี้</span></li></ol>`;
  }
  function detail(b) {
    const gap = missing(b), open = isOpen(b), fav = state.favorites.has(b.id);
    const balance = `<div class="detail-balance"><span class="amount-main">${money(gap)}</span><span class="amount-target"> / ${money(b.goal)}</span><p class="bill-meta">ยอดที่ยังขาด / ยอดบิล${open && dueText(b) ? ` · ${dueText(b)}` : ''}</p></div>${progress(b)}<p class="bill-meta">ช่วยแล้ว <b>${money(b.raised)}</b> จาก ${b.helpers} คน</p>`;
    const action = open ? `<button class="button coral full" data-start-help="${b.id}">ช่วยอีกนิด เริ่ม ฿20 ${icon('heart')}</button>` : `<div class="support-note">${icon(b.status === 'paid' ? 'check' : 'clock')}<p><b>${b.status === 'paid' ? 'บิลนี้จ่ายครบแล้ว ขอบคุณทุกแรงช่วย' : b.status === 'closed' ? 'บิลนี้ปิดรับแล้ว' : 'ครบยอดแล้ว รอทีมยืนยันกับผู้ให้บริการ'}</b><br>ยังไม่ต้องจ่ายเพิ่มสำหรับบิลนี้</p></div>`;
    return `<section class="view detail-view"><div class="view-header">${backButton('#/bills', 'บิลที่รอเรา')}<div class="header-actions"><button class="icon-button" data-share="${b.id}" aria-label="บอกต่อบิลนี้">${icon('send')}</button><button class="icon-button${fav ? ' is-saved' : ''}" data-save="${b.id}" aria-pressed="${fav}" aria-label="${fav ? 'ยกเลิกเก็บ' : 'เก็บ'}บิลนี้">${icon('heart')}</button></div></div>
      <div class="detail-layout"><div class="detail-main"><div class="detail-title"><span class="category-label">${safe(b.label)}</span><h1 class="view-title" tabindex="-1">${safe(b.title)}</h1><p class="bill-meta">โดย ${safe(b.alias)}</p><p class="bill-meta">${icon('pin')} ${safe(b.region)} ${statusPill(b)}</p></div>
      <div class="detail-progress">${balance}</div>
      <section class="story-section"><h2>รายละเอียด</h2><p>${safe(b.story)}</p></section>
      <section class="story-section"><h2>ช่วยยังไง</h2>${howItWorks(b)}<button class="text-link" data-help>เราดูแลความไว้ใจอย่างไร ${icon('chevron')}</button></section>
      <p class="small-text">เห็นอะไรผิดปกติในบิลนี้? <button class="text-link inline-link" data-report>แจ้งทีม</button></p></div>
      <aside class="detail-aside"><div class="form-card">${statusPill(b)}${balance}<div class="summary-box"><div class="summary-row"><span>จ่ายเข้า</span><b>${safe(b.pay.provider || '-')}</b></div>${b.dueDate ? `<div class="summary-row"><span>กำหนดตามบิล</span><b>${dueDate(b)}</b></div>` : ''}</div>${action}<p class="small-text centered">จ่ายตรงเข้าบิล ไม่ผ่านบัญชีผู้ขอ</p></div></aside></div>
      <div class="mobile-helpbar"><button class="button outline" data-share="${b.id}">บอกต่อคนละนิด</button>${open ? `<button class="button coral" data-start-help="${b.id}">ช่วยอีกนิด ${icon('heart')}</button>` : `${statusPill(b)}`}</div></section>`;
  }
  function amountError(b, value) {
    const gap = missing(b), min = Math.min(20, gap);
    if (!Number.isFinite(value) || !Number.isInteger(value)) return 'กรอกจำนวนเงินเป็นบาทเต็มจำนวน';
    if (value < min) return `เริ่มที่ ${money(min)} เลือกตามกำลังที่สะดวกได้`;
    if (value > gap) return `ยอดที่ยังขาดคือ ${money(gap)} ช่วยไม่เกินยอดนี้นะ`;
    return '';
  }
  function help(b, error = '') {
    if (!isOpen(b)) return closedView(b);
    const amount = state.amounts[b.id] ?? Math.min(20, missing(b));
    const preset = [20, 50, 100].includes(amount);
    return `<section class="view help-view">${topbar('ช่วยจ่ายคนละนิด', {back:`#/bill/${b.id}`})}<div class="help-layout"><div class="help-summary">${categoryIcon(b)}<h2>${safe(b.title)}</h2><p class="bill-meta">โดย ${safe(b.alias)} · ยังขาด ${money(missing(b))}</p></div><div class="help-form form-card"><h2>วันนี้อยากช่วยเท่าไร</h2><form id="help-form" data-bill="${b.id}" novalidate><div class="amount-options" role="group" aria-label="เลือกจำนวนเงิน">${[20, 50, 100].map(n => `<button class="amount-option${amount === n ? ' selected' : ''}" type="button" data-amount="${n}" ${n > missing(b) ? 'disabled' : ''} aria-pressed="${amount === n}">${money(n)}</button>`).join('')}</div><div class="form-field"><label class="field-label" for="custom-amount">หรือระบุจำนวนเอง</label><div class="amount-input"><input class="input" id="custom-amount" name="amount" type="number" inputmode="numeric" min="${Math.min(20, missing(b))}" max="${missing(b)}" step="1" value="${preset ? '' : amount}" placeholder="ระบุจำนวนอื่น" autocomplete="off" aria-describedby="amount-error" ${error ? 'aria-invalid="true"' : ''}><span aria-hidden="true">฿</span></div><p id="amount-error" class="field-error" role="alert">${error}</p></div><button type="submit" class="button coral full">ไปหน้าจ่ายบิล ${icon('arrow')}</button></form><div class="support-note">${icon('lock')}<p>เงินจ่ายตรงเข้าบิลของ ${safe(b.pay.provider || 'ผู้ให้บริการ')}<br>ไม่ผ่านบัญชีผู้ขอหรือทีม</p></div></div></div></section>`;
  }
  function pay(b) {
    if (!isOpen(b)) return closedView(b);
    const amount = state.amounts[b.id];
    if (!amount || amountError(b, amount)) return help(b, amount ? amountError(b, amount) : '');
    const p = b.pay;
    return `<section class="view review-view">${topbar(`จ่าย ${money(amount)} ตรงเข้าบิล`, {back:`#/help/${b.id}`})}<div class="help-layout"><div class="help-summary">${categoryIcon(b)}<h2>${safe(b.title)}</h2><p class="bill-meta">โดย ${safe(b.alias)}</p></div><div class="help-form form-card">
      <div class="summary-box"><div class="summary-row"><span>จ่ายให้</span><b>${safe(p.provider || '-')}</b></div><div class="summary-row pay-ref"><span>${safe(p.refLabel || 'เลขอ้างอิง')}</span><b>${safe(p.ref || '-')}${p.ref ? ` <button class="icon-button small-icon" data-copy="${safe(p.ref)}" aria-label="คัดลอกเลขอ้างอิง">${icon('copy')}</button>` : ''}</b></div><div class="summary-row total"><span>ยอดที่คุณช่วย</span><b>${money(amount)}</b></div></div>
      ${p.qr ? `<img class="pay-qr" src="${safe(p.qr)}" alt="QR สำหรับจ่ายบิล ${safe(b.title)}" width="240" height="240">` : ''}
      ${Array.isArray(p.how) && p.how.length ? `<ol class="pay-how">${p.how.map(step => `<li>${safe(step)}</li>`).join('')}</ol>` : ''}
      <div class="support-note warm">${icon('info')}<p>ตรวจชื่อผู้รับเงินในแอปให้เป็น <b>${safe(p.provider || 'ผู้ให้บริการ')}</b> ก่อนกดยืนยัน และเก็บสลิปไว้ส่งให้ทีม</p></div>
      <button class="button coral full" data-paid="${b.id}">${contact ? `จ่ายแล้ว ส่งสลิปให้ทีม` : 'จ่ายแล้ว'} ${icon('check')}</button>
      <p class="small-text centered">ยอดบนหน้าเว็บจะอัปเดตเมื่อทีมตรวจสลิปแล้ว</p></div></div></section>`;
  }
  function closedView(b) {
    return `<section class="view">${topbar('บิลนี้ไม่ต้องช่วยเพิ่มแล้ว', {back:`#/bill/${b.id}`})}<div class="empty-state">${icon(b.status === 'paid' ? 'check' : 'clock')}<h2>${b.status === 'paid' ? 'จ่ายครบแล้ว ขอบคุณทุกแรงช่วย' : 'ครบยอดหรือปิดรับแล้ว'}</h2><p>ลองดูบิลอื่นที่ยังรอเราอยู่ได้เลย</p><a class="button primary" href="#/bills">ดูบิลที่รอเรา</a></div></section>`;
  }
  function thanks(b) {
    const pledge = [...state.pledges].reverse().find(p => p.billId === b.id);
    return `<section class="view success-view"><div class="success-layout"><div class="success-content"><div class="success-check">${icon('check')}</div><h1 class="view-title success-title" tabindex="-1">ขอบคุณที่ช่วย<br>คนละนิดนะคะ</h1><p class="success-description">${pledge ? `แรงช่วย ${money(pledge.amount)} ของคุณ` : 'แรงช่วยเล็ก ๆ ของคุณ'}<br>มีความหมายมากจริง ๆ</p>${contactButton(`ยังไม่ได้ส่งสลิป? ส่งทาง ${safe(contact?.label)}`, 'outline')}<a class="button outline full" href="#/bill/${b.id}">ดูความคืบหน้าบิลนี้ ${icon('arrow')}</a><a class="back-home" href="#/">กลับหน้าหลัก</a></div><img class="success-art" src="assets/woman-heart.webp" width="650" height="650" alt="ภาพวาดผู้หญิงกอดหัวใจด้วยรอยยิ้ม"></div></section>`;
  }
  function timeline(b) {
    const step = b.status === 'paid' ? 2 : missing(b) ? 0 : 1;
    const items = [['เปิดรับแรงช่วย', `ช่วยแล้ว ${money(b.raised)} / ${money(b.goal)}`], ['ครบยอดบิล', 'ทีมตรวจกับผู้ให้บริการว่ารับยอดครบ'], ['จ่ายครบแล้ว', 'ปิดรับ บิลรอบนี้ไม่มียอดค้าง']];
    return `<ol class="timeline">${items.map(([title, desc], i) => `<li class="timeline-item${i <= step ? ' done' : ''}"><span class="timeline-dot">${i < step ? icon('check') : i + 1}</span><div><b>${title}</b><p>${desc}</p></div></li>`).join('')}</ol>`;
  }
  function activity() {
    const total = state.pledges.reduce((n, p) => n + p.amount, 0);
    const mine = [...new Set(state.pledges.map(p => p.billId))].map(getBill).filter(Boolean);
    return `<section class="view activity-view">${topbar('รอยต่อการช่วย')}<div class="activity-summary"><span class="category-icon water">${icon('leaf')}</span><div><p class="muted">ที่คุณช่วยจากเครื่องนี้</p><h2>${money(total)} <span class="small-text">จาก ${state.pledges.length} ครั้ง</span></h2></div></div><div class="activity-list">${mine.length ? mine.map(b => `<article class="activity-card"><div class="section-label"><div><span class="category-label">${safe(b.label)}</span><h2>${safe(b.title)}</h2></div><b class="activity-amount">${money(state.pledges.filter(p => p.billId === b.id).reduce((n, p) => n + p.amount, 0))}</b></div>${timeline(b)}<a class="text-link" href="#/bill/${b.id}">ดูบิลและยอดล่าสุด ${icon('chevron')}</a></article>`).join('') : `<div class="empty-state soft-empty">${icon('heart')}<h2>รอยต่อแรก เริ่มได้จากนิดเดียว</h2><p>เมื่อคุณช่วยบิลไหน ความคืบหน้าของบิลนั้นจะมาอยู่ตรงนี้</p><a class="button primary" href="#/bills">เลือกบิลที่อยากช่วย ${icon('arrow')}</a></div>`}</div></section>`;
  }
  function profile() {
    const total = state.pledges.reduce((n, p) => n + p.amount, 0), unique = new Set(state.pledges.map(p => p.billId)).size;
    return `<section class="view profile-view">${topbar('พื้นที่ของฉัน')}<div class="profile-layout"><div><div class="profile-card"><div class="profile-avatar">${icon('heart')}</div><h2>เพื่อนคนละนิด</h2><p class="muted">วันนี้เป็นผู้ให้ วันหน้าอาจเป็นผู้รับ</p><div class="profile-stats"><div><b>${state.pledges.length}</b><span>ครั้งที่ช่วย</span></div><div><b>${unique}</b><span>บิลที่ช่วย</span></div><div><b>${money(total)}</b><span>ยอดที่ช่วย</span></div></div><p class="small-text">นับจากที่คุณกด "จ่ายแล้ว" บนเครื่องนี้ ไม่ต้องสมัครสมาชิก</p></div></div><div class="profile-menu"><a href="#/activity">${icon('clock')}<span>ประวัติการช่วยเหลือ</span>${icon('chevron')}</a><button data-favorites>${icon('heart')}<span>บิลที่เก็บไว้ <small>(${state.favorites.size})</small></span>${icon('chevron')}</button><a href="#/request">${icon('send')}<span>ขอความช่วยเหลือ หรือส่งต่อให้คนที่ต้องการ</span>${icon('chevron')}</a><button data-help>${icon('shield')}<span>ความไว้ใจและความเป็นส่วนตัว</span>${icon('chevron')}</button>${contact ? `<a href="${safe(contact.url)}" target="_blank" rel="noopener noreferrer">${icon('chat')}<span>ติดต่อทีมคนละนิด</span>${icon('chevron')}</a>` : ''}</div></div></section>`;
  }
  function requestView() {
    return `<section class="view request-view">${topbar('ส่งต่อคนละนิด')}<div class="request-layout"><div class="request-intro"><span class="category-icon electricity">${icon('send')}</span><h2>วันนี้รับแรงช่วย<br>วันหน้าอาจส่งต่อ</h2><p>ถ้าคุณหรือคนที่คุณรู้จักกำลังติดขัดเรื่องบิลจำเป็น<br>ส่งเรื่องมาให้ทีมได้ ไม่ต้องเปิดหน้า และไม่ต้องคืนเงินให้ผู้ช่วย</p></div><div class="form-card request-card"><h2>เตรียมอะไรบ้าง</h2><ul class="pay-how"><li>รูปบิลตัวจริงรอบล่าสุด (ค่าไฟ ค่าน้ำ หรือบิลจำเป็นอื่น)</li><li>ความเกี่ยวข้องกับบิล เช่น เป็นเจ้าของบัญชี ผู้เช่า หรือคนในครอบครัว</li><li>เล่าสั้น ๆ ว่าตอนนี้ติดขัดเรื่องอะไร เท่าที่สบายใจ</li></ul><div class="support-note">${icon('shield')}<p>ทีมดูบิลกับคุณเป็นการส่วนตัวก่อนเปิดรับ หน้าเว็บแสดงแค่ชื่อเรียก จังหวัด และยอดบิล ไม่แสดงชื่อจริงหรือที่อยู่</p></div>${contact ? contactButton(`ส่งเรื่องทาง ${safe(contact.label)}`) : `<p class="small-text">ช่องทางติดต่อทีมจะเปิดเร็ว ๆ นี้</p>`}</div></div></section>`;
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
    openSupport(`<div class="modal-body"><h2 class="modal-title">ช่วยกันอย่างไว้ใจได้</h2><div class="trust-checks"><div class="trust-item">${icon('file')}<div><b>ทีมดูบิลตัวจริงก่อนเปิดรับ</b><span>คุยกับผู้ขอและตรวจยอดกับบิลรอบล่าสุด</span></div></div><div class="trust-item">${icon('lock')}<div><b>จ่ายตรงเข้าบิล</b><span>เงินไปที่ผู้ให้บริการโดยตรง ไม่ผ่านบัญชีผู้ขอหรือทีม</span></div></div><div class="trust-item">${icon('eye')}<div><b>เปิดเผยเท่าที่จำเป็น</b><span>แสดงชื่อเรียก จังหวัด ยอดบิล และเลขสำหรับจ่ายเท่านั้น</span></div></div></div><details class="faq"><summary>ยอดบนหน้าเว็บอัปเดตเมื่อไร ${icon('chevron')}</summary><p>ทีมอัปเดตหลังตรวจสลิปที่ส่งมา จึงอาจช้ากว่ายอดจริงเล็กน้อย ดูยอดที่ยังขาดก่อนจ่ายทุกครั้ง เมื่อครบแล้วทีมจะปิดรับทันที</p></details><details class="faq"><summary>ถ้าเห็นอะไรผิดปกติ ${icon('chevron')}</summary><p>${contact ? `แจ้งทีมได้ทาง ${safe(contact.label)} ทีมจะพักบิลไว้ระหว่างตรวจ และไม่เปิดเผยชื่อผู้แจ้ง` : 'แจ้งทีมได้ตลอด ทีมจะพักบิลไว้ระหว่างตรวจ และไม่เปิดเผยชื่อผู้แจ้ง'}</p></details><button class="button primary full" data-close>เข้าใจแล้ว</button></div>`);
  }
  function reportModal() {
    openSupport(`<div class="modal-body"><h2 class="modal-title">เห็นอะไรผิดปกติ บอกทีมได้เลย</h2><p class="muted">เช่น บิลซ้ำ จ่ายไปแล้ว เลขอ้างอิงแปลก หรือมีคนชวนให้โอนนอกระบบ ทีมจะพักบิลไว้ระหว่างตรวจ และไม่เปิดเผยชื่อผู้แจ้ง</p>${contact ? contactButton(`แจ้งทีมทาง ${safe(contact.label)}`) : ''}<button class="button outline full" data-close>ปิด</button></div>`, 'แจ้งทีม');
  }
  function favoritesModal() {
    const list = bills.filter(b => state.favorites.has(b.id));
    openSupport(`<div class="modal-body"><h2 class="modal-title">บิลที่เก็บไว้</h2>${list.length ? `<div class="saved-list">${list.map(b => `<a class="saved-item" href="#/bill/${b.id}" data-close-on-nav>${categoryIcon(b)}<span><b>${safe(b.title)}</b><small>ยังขาด ${money(missing(b))}</small></span>${icon('chevron')}</a>`).join('')}</div>` : `<div class="empty-state">${icon('heart')}<p>แตะหัวใจบนบิลที่อยากกลับมาดู<br>บิลนั้นจะมาอยู่ตรงนี้</p></div>`}<button class="button outline full" data-close>ปิด</button></div>`, 'บิลที่เก็บไว้');
  }
  function render({focus = true, restore = false} = {}) {
    const path = route(), segments = path.split('/').filter(Boolean); let html = '', active = 'home';
    if (path === '/') html = home();
    else if (path === '/bills') {html = browse(); active = 'browse';}
    else if (path === '/activity') {html = activity(); active = 'activity';}
    else if (path === '/me') {html = profile(); active = 'profile';}
    else if (path === '/request') {html = requestView(); active = 'profile';}
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
    if (target.matches('[data-copy]')) {copyText(target.dataset.copy, 'คัดลอกเลขแล้ว ไปวางในแอปธนาคารได้เลย'); return;}
    if (target.matches('[data-report]')) {reportModal(); return;}
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
      if (contact) window.open(contact.url, '_blank', 'noopener');
      go(`/thanks/${b.id}`); return;
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'bill-search') {state.search = event.target.value; document.querySelector('#bills-results').innerHTML = browseCards(); hydrateIcons(); return;}
    if (event.target.id === 'custom-amount') updateAmountForm(false);
  });
  document.addEventListener('focusout', event => {if (event.target.id === 'custom-amount' && event.target.value !== '') updateAmountForm(true);});
  document.addEventListener('submit', event => {
    if (event.target.id === 'help-form') {
      event.preventDefault(); const b = getBill(event.target.dataset.bill);
      if (!updateAmountForm(true)) {document.querySelector('#custom-amount').focus(); return;}
      go(`/pay/${b.id}`);
    }
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
