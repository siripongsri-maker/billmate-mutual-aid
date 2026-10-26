# คนละนิด แผน 1: ฐานระบบ, ล็อกอิน และหน้าแอดมินชุดแรก — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ทีมล็อกอินเข้า `/admin` ได้ เห็นภาพรวมงานค้าง จัดการข้อความจากฟอร์มติดต่อ เพิ่ม/ลบคนในทีม และดูบันทึกการทำงาน — บนฐานข้อมูลที่มีบทบาทและสิทธิ์พร้อมสำหรับแผนถัดไป

**Architecture:** ตาราง `profiles`/`settings`/`audit_log` + RLS ใน Lovable Cloud; ทุกการกระทำของแอดมินผ่าน server function (`createServerFn`) ที่เช็กบทบาทด้วย `supabaseAdmin` ฝั่ง server และเขียน `audit_log`; หน้า React ใหม่อยู่ใน `src/routes/` ของแอป TanStack Start เดิม ใช้โทเคนดีไซน์ของคนละนิด

**Tech Stack:** TanStack Start/Router, React 19, Supabase JS (`@/integrations/supabase/*`), zod, vitest + Testing Library, Node 24 สำหรับสคริปต์ตรวจ RLS

**Spec:** `docs/superpowers/specs/2026-10-26-konlanid-backend-design.md` (ส่วน 3, 4, 5 "ทีม", 6, 8)

## แผนทั้งหมด (แต่ละแผนใช้งานและทดสอบได้ด้วยตัวเอง)

1. **แผนนี้** — ฐานระบบ, ล็อกอินอีเมล+Google, แอดมิน: ภาพรวม / ข้อความ / ทีม / บันทึก
2. LINE Login + ผู้ขอยืนยันตัวตน (อัปโหลดบัตร+เซลฟี, storage `id-docs`, คิวตรวจตัวตน, ลบเอกสารอัตโนมัติ)
3. บิล: ผู้ขอยื่นบิล, คิวตรวจบิล + ทดสอบชื่อพร้อมเพย์, หน้าสาธารณะ React + QR พร้อมเพย์ (ย้ายดีไซน์จาก `public/konlanid`)
4. แรงช่วย: อัปโหลดสลิป, อ่าน QR สลิป + กันซ้ำ, ผู้ขอยืนยัน, trigger ยอด, rate limit, คิวสลิปมีปัญหา
5. ใบเสร็จ + งานตั้งเวลา (ค้างเกิน 30 วัน, ใบเสร็จเกิน 7 วัน, ลบไฟล์ตามกำหนด) + ตัวเลขงานค้างครบในภาพรวม
6. เปิดใช้: redirect หน้าเก่า, ลบแอปตัวอย่าง "ช่วยกัน", E2E, ทดสอบโอนจริง 3 ธนาคาร

## Global Constraints

- การเปลี่ยนฐานข้อมูล: เขียน SQL ที่รันซ้ำได้ไว้ใน `db/sql/` แล้วให้ Lovable สร้าง migration ใน `drizzle/migrations/` และรันจริง ห้ามแก้ `drizzle/schema.ts`, `src/integrations/supabase/*`, `src/routeTree.gen.ts` ด้วยมือ (ไฟล์ generate)
- เปิด RLS ทุกตารางใหม่; key สาธารณะต้องอ่าน `profiles`, `settings`, `audit_log` ไม่ได้
- `supabaseAdmin` (service role) ใช้ได้เฉพาะใน server function หลังผ่าน `requireAdmin` เท่านั้น
- ทุกการเปลี่ยนแปลงโดยแอดมินเขียน `audit_log` (action, target_type, target_id, detail)
- บทบาท: `requester` | `admin` | `owner`; เฉพาะ `owner` เพิ่ม/ลบแอดมินได้
- ค่าเริ่มต้นใน `settings`: `overdue_limit_days`=30, `receipt_days`=7, `doc_retention_days`=30, `slip_retention_days`=180, `pending_alert_hours`=48
- ภาษาหน้าเว็บ: ไทย, น้ำเสียงไม่ตีตรา ใช้ "นะ" ไม่ใช้ "นะคะ/นะครับ"; ตัวอักษรเนื้อหา ≥13px, คอนทราสต์ ≥4.5:1, ปุ่มกด ≥44px, สถานะมีข้อความกำกับไม่ใช้สีอย่างเดียว
- ไม่แสดงชื่อตามบัตร เลขพร้อมเพย์ หรือเอกสารในหน้าสาธารณะ

## Review Focus

1. **ผู้ใช้ที่ล็อกอินแต่ไม่ใช่ทีม เปิด `/admin`** → เห็น "หน้านี้สำหรับทีมคนละนิด" และ server function ทุกตัวตอบ 403 ไม่หลุดตัวเลขหรือข้อความใด ๆ (เทสต์ใน Task 4)
2. **session หมดอายุระหว่างใช้หน้าแอดมิน** → พากลับ `/login?next=<หน้าเดิม>` แล้วกลับมาหน้าเดิมหลังล็อกอิน (เทสต์ใน Task 3)
3. **owner ลดสิทธิ์ตัวเอง หรือทำให้ไม่เหลือ owner** → ถูกปฏิเสธพร้อมเหตุผล (เทสต์ใน Task 6)
4. **ข้อความยาว 2,000 ตัวอักษร/อีโมจิ/ไม่มีช่องทางติดต่อ** → การ์ดไม่ล้นจอ 390px, บันทึกโน้ตล้มเหลวแล้วข้อความที่พิมพ์ไม่หาย (เทสต์ใน Task 5)
5. **รหัส OTP ผิด/หมดอายุ/ขอบ่อยเกิน** → ข้อความไทยที่บอกว่าต้องทำอะไร และขอรหัสใหม่ได้หลัง 60 วินาที (เทสต์ใน Task 3)

---

### Task 1: ฐานข้อมูลบทบาท, ตั้งค่า, บันทึกการทำงาน + สคริปต์ตรวจ RLS

**Files:**
- Create: `db/sql/0001_foundation.sql`
- Create: `scripts/check-rls.mjs`
- Modify: `package.json` (เพิ่ม script `"check:rls": "node scripts/check-rls.mjs"`)

**Interfaces:**
- Produces (ฐานข้อมูล):
  - `public.profiles(user_id uuid pk → auth.users on delete cascade, display_name text ≤60, contact text ≤120, role text check in ('requester','admin','owner') default 'requester', suspended_until timestamptz null, created_at timestamptz default now())`
  - trigger `on_auth_user_created` → `public.handle_new_user()` สร้างแถว profiles อัตโนมัติ (`display_name` จาก `raw_user_meta_data->>'name'` ตัดที่ 60 ตัว หรือ null)
  - `public.is_admin() returns boolean` (security definer, stable): ผู้ใช้ปัจจุบันมี role `admin`/`owner` และไม่ถูกพัก
  - `public.settings(key text pk, value jsonb not null, updated_at)` + ค่าเริ่มต้นตาม Global Constraints
  - `public.audit_log(id bigint identity pk, actor_id uuid, action text, target_type text, target_id text, detail jsonb default '{}', created_at)`
  - RLS: `profiles` select ของตัวเอง; update ได้เฉพาะคอลัมน์ `display_name`, `contact` ของตัวเอง (column grant); `settings`/`audit_log` ไม่มี policy สำหรับ anon/authenticated (อ่านผ่าน server function)
- Produces (สคริปต์): `node scripts/check-rls.mjs` อ่าน `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` จาก `.env`, พิมพ์ `PASS`/`FAIL` ต่อข้อ, exit 1 ถ้ามี FAIL

- [ ] **Step 1: เขียนสคริปต์ตรวจ (ทดสอบก่อน)** — `scripts/check-rls.mjs` ด้วย `fetch` ล้วน ตรวจด้วย key สาธารณะ:
  - `GET /rest/v1/profiles?select=user_id` → 200 และ `[]`
  - `GET /rest/v1/settings?select=key` → `[]` หรือ 401/403
  - `GET /rest/v1/audit_log?select=id` → `[]` หรือ 401/403
  - `POST /rest/v1/profiles` `{user_id: crypto.randomUUID(), role:'owner'}` → 401/403 (42501)
  - `contact_messages`: อ่านได้ `[]`; `POST` ที่ตั้ง `status:'done'` → 42501; `PATCH ?topic=eq.ask_help` `Prefer: count=exact` → `content-range: */0`; `DELETE` เช่นกัน → `*/0`
- [ ] **Step 2: รันให้เห็นว่าล้ม** — Run: `npm run check:rls` · Expected: FAIL ที่ `profiles` (PGRST205 ไม่พบตาราง)
- [ ] **Step 3: เขียน `db/sql/0001_foundation.sql`** ตาม Interfaces ทุกคำสั่งรันซ้ำได้ (`create ... if not exists`, `create or replace function`, `drop policy if exists` ก่อน `create policy`, `insert ... on conflict (key) do nothing` สำหรับ settings), ปิดท้าย `notify pgrst, 'reload schema';`
- [ ] **Step 4: ให้ Lovable สร้าง migration และรัน** — ส่งข้อความนี้ให้เจ้าของโปรเจกต์วางในแชต Lovable แล้วรอผล:
  `Please create a migration from db/sql/0001_foundation.sql exactly as written, run it on Lovable Cloud, then paste the results of: select tablename, rowsecurity from pg_tables where tablename in ('profiles','settings','audit_log'); select policyname, tablename, cmd from pg_policies where tablename in ('profiles','settings','audit_log'); select key from settings order by key;`
  Expected: 3 ตาราง `rowsecurity=true`, policy ของ profiles ครบ, settings 5 คีย์
- [ ] **Step 5: รันสคริปต์อีกครั้ง** — Run: `npm run check:rls` · Expected: ทุกข้อ `PASS`
- [ ] **Step 6: ตั้ง owner คนแรก** — ขอให้เจ้าของโปรเจกต์ล็อกอินครั้งแรก (หลัง Task 3) แล้วให้ Lovable รัน `update public.profiles set role = 'owner' where user_id = (select id from auth.users where email = '<อีเมลที่เจ้าของใช้ล็อกอิน>');` — อีเมลให้เจ้าของโปรเจกต์บอกเอง
- [ ] **Step 7: Commit** — `git add db/sql/0001_foundation.sql scripts/check-rls.mjs package.json && git commit -m "feat(db): profiles, roles, settings, audit log with RLS checks"`

### Task 2: โทเคนดีไซน์คนละนิดใน React + เลย์เอาต์พื้นฐาน

**Files:**
- Modify: `src/styles.css` (เพิ่มโทเคนใต้ selector `.kl`)
- Create: `src/components/kl/KlShell.tsx`, `src/components/kl/StatusPill.tsx`
- Test: `src/components/kl/StatusPill.test.tsx`

**Interfaces:**
- Produces: `<KlShell title?: string; children: ReactNode>` — หัวโลโก้ "นิด." + เนื้อหา; `<StatusPill tone: 'new'|'progress'|'done'|'muted'|'danger'; children: ReactNode>` แสดงไอคอน + ข้อความเสมอ
- โทเคนคัดลอกค่าจาก `public/konlanid/style.css` `:root` (หลังแก้คอนทราสต์): `--kl-cream #fffaf0`, `--kl-paper #fffdf7`, `--kl-warm #f6eedf`, `--kl-ink #173f35`, `--kl-green #226f55`, `--kl-deep #154f40`, `--kl-sage #e5efda`, `--kl-coral #f79498`, `--kl-coral-light #fde6df`, `--kl-yellow #ffda7a`, `--kl-muted #5f6359`, `--kl-border #e9e2d3`; ฟอนต์ Mali (หัวข้อ) + Noto Sans Thai (เนื้อหา, line-height 1.7)

- [ ] **Step 1: เทสต์** `StatusPill.test.tsx`: render `<StatusPill tone="new">ใหม่</StatusPill>` → มีข้อความ "ใหม่" และ svg `aria-hidden="true"`; ทุก tone มี class ต่างกัน
- [ ] **Step 2:** Run `npx vitest run src/components/kl` · Expected: FAIL (ไม่พบโมดูล)
- [ ] **Step 3:** เพิ่มโทเคน + ฟอนต์ (Google Fonts link ใน `__root.tsx` head) และสร้างสองคอมโพเนนต์
- [ ] **Step 4:** Run `npx vitest run src/components/kl && npx tsc --noEmit -p .` · Expected: PASS, ไม่มี type error
- [ ] **Step 5: Commit** `feat(ui): konlanid design tokens and shell`

### Task 3: ล็อกอินด้วยอีเมล (รหัส 6 หลัก) และ Google

**Files:**
- Create: `src/lib/auth.ts`, `src/routes/login.tsx`
- Test: `src/lib/auth.test.ts`, `src/routes/login.test.tsx`

**Interfaces:**
- Produces (`src/lib/auth.ts`):
  - `useSession(): { session: Session | null; loading: boolean }` (ฟัง `supabase.auth.onAuthStateChange`)
  - `sendEmailCode(email: string): Promise<AuthResult>` → `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })`
  - `verifyEmailCode(email: string, code: string): Promise<AuthResult>` → `supabase.auth.verifyOtp({ email, token: code, type: 'email' })`
  - `signInWithGoogle(next: string): Promise<AuthResult>` → `signInWithOAuth({ provider: 'google', options: { redirectTo: \`${origin}/login?next=${encodeURIComponent(next)}\` } })`
  - `safeNext(raw: string | null): string` — คืน path ภายในเว็บเท่านั้น (ขึ้นต้น `/` แต่ไม่ใช่ `//`), ไม่งั้น `/`
  - `authErrorMessage(err: { status?: number; code?: string; message?: string }): string` — ไทย: รหัสผิด/หมดอายุ → "รหัสไม่ถูกต้องหรือหมดอายุ ขอรหัสใหม่ได้เลย"; 429/`over_email_send_rate_limit` → "ขอรหัสบ่อยเกินไป รอสักครู่แล้วลองใหม่นะ"; อื่น ๆ → "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งนะ"
  - `type AuthResult = { ok: true } | { ok: false; message: string }`
- `/login?next=…`: ขั้น 1 อีเมล + ปุ่ม "ส่งรหัสเข้าอีเมล" + ปุ่ม "เข้าสู่ระบบด้วย Google"; ขั้น 2 ช่องรหัส 6 หลัก (`inputMode="numeric"`, `autoComplete="one-time-code"`) + "ขอรหัสใหม่" เปิดได้หลัง 60 วินาที; มี session แล้ว → `navigate(safeNext(next))`

- [ ] **Step 1: เทสต์ `auth.test.ts`** (mock `@/integrations/supabase/client`):
  - `safeNext('/admin')==='/admin'`, `safeNext('//evil.com')==='/'`, `safeNext('https://evil.com')==='/'`, `safeNext(null)==='/'`
  - `sendEmailCode('a@b.co')` เรียก `signInWithOtp` ด้วย `{ email:'a@b.co', options:{ shouldCreateUser:true } }`
  - `authErrorMessage({status:429})` ตรงข้อความ rate limit; `authErrorMessage({code:'otp_expired'})` ตรงข้อความรหัสหมดอายุ
- [ ] **Step 2: เทสต์ `login.test.tsx`**: อีเมลไม่ถูกรูปแบบ → แสดง "กรอกอีเมลให้ถูกต้อง" และไม่เรียก `sendEmailCode`; ส่งสำเร็จ → เห็นช่องรหัส; ปุ่ม "ขอรหัสใหม่" disabled จนครบ 60 วินาที (`vi.useFakeTimers`); verify ล้มเหลว → แสดงข้อความจาก `authErrorMessage` และค่าในช่องยังอยู่
- [ ] **Step 3:** Run `npx vitest run src/lib/auth.test.ts src/routes/login.test.tsx` · Expected: FAIL
- [ ] **Step 4:** Implement `src/lib/auth.ts` และ `src/routes/login.tsx` (ใช้ `KlShell`)
- [ ] **Step 5:** Run เทสต์ข้างบน + `npx tsc --noEmit -p .` · Expected: PASS
- [ ] **Step 6: ตั้งค่าใน Lovable (เจ้าของโปรเจกต์)** — เปิด Email OTP และ Google provider ใน Cloud → Auth, เพิ่ม redirect URL ของเว็บที่เผยแพร่และ preview; ตรวจ: ล็อกอินด้วยอีเมลจริงได้ แล้วมีแถวใน `profiles` (ยืนยันผ่าน Lovable)
- [ ] **Step 7: Commit** `feat(auth): email code and Google sign-in`

### Task 4: ด่านแอดมิน + หน้าภาพรวม

**Files:**
- Create: `src/server/admin-guard.ts`, `src/server/admin-overview.ts`, `src/routes/admin.tsx`, `src/routes/admin.index.tsx`
- Test: `src/server/admin-guard.test.ts`, `src/routes/admin.test.tsx`

**Interfaces:**
- Consumes: `requireSupabaseAuth` (`@/integrations/supabase/auth-middleware`), `supabaseAdmin` (`@/integrations/supabase/client.server`), `KlShell`, `StatusPill`, `useSession`
- Produces:
  - `type Role = 'requester' | 'admin' | 'owner'`; `type StaffProfile = { userId: string; role: Role; suspendedUntil: string | null }`
  - `canAccessAdmin(p: StaffProfile | null, now = new Date()): boolean` — true เมื่อ role เป็น admin/owner และ (`suspendedUntil` เป็น null หรือ ≤ now)
  - `requireAdmin` — middleware ต่อจาก `requireSupabaseAuth`, โหลด profile ด้วย `supabaseAdmin`, ไม่ผ่าน → `throw` error ที่มี `statusCode: 403`; ผ่าน → context `{ userId, role }`
  - `logAction(actorId: string, action: string, targetType: string, targetId: string, detail?: Record<string, unknown>): Promise<void>` (ใน `admin-guard.ts`)
  - `getAdminOverview` server fn (middleware `requireAdmin`) → `{ newMessages: number; inProgressMessages: number; teamCount: number }`
- `isUnauthorized(err: unknown): boolean` — true เมื่อ error message ขึ้นต้นด้วย `Unauthorized` (รูปแบบที่ `requireSupabaseAuth` throw) ; `isForbidden(err: unknown): boolean` — true เมื่อ `statusCode === 403`
- `/admin` layout: ไม่มี session → `/login?next=/admin…`; server fn ล้มด้วย `isUnauthorized` → เช่นเดียวกัน; 403 → หน้า "หน้านี้สำหรับทีมคนละนิด" (ไม่เรียกข้อมูลอื่น); เมนู: ภาพรวม · ข้อความ · ทีม · บันทึก
- `/admin` (index): การ์ดตัวเลขกดได้ ("ข้อความใหม่ N" → `/admin/messages?status=new`), ข้อความกำกับทุกตัวเลข

- [ ] **Step 1: เทสต์ `admin-guard.test.ts`**: `isUnauthorized(new Error('Unauthorized: Invalid token'))===true`, `isForbidden({statusCode:403})===true`; `canAccessAdmin(null)===false`; requester → false; admin → true; owner → true; admin ที่ `suspendedUntil` อนาคต → false; อดีต → true
- [ ] **Step 2: เทสต์ `admin.test.tsx`** (mock server fn): ตอบ 403 → เห็น "หน้านี้สำหรับทีมคนละนิด" และไม่มีตัวเลขใด ๆ ในหน้า; ตอบ 401 → `navigate` ไป `/login?next=%2Fadmin`; ตอบข้อมูล → เห็น "ข้อความใหม่" กับตัวเลข
- [ ] **Step 3:** Run `npx vitest run src/server/admin-guard.test.ts src/routes/admin.test.tsx` · Expected: FAIL
- [ ] **Step 4:** Implement ไฟล์ทั้งหมด
- [ ] **Step 5:** Run เทสต์ + `npx tsc --noEmit -p .` · Expected: PASS
- [ ] **Step 6: ตรวจจริง** — บัญชีที่ไม่ใช่ทีมเปิด `/admin` เห็นข้อความปฏิเสธ; owner เห็นภาพรวม; `npm run check:rls` ยัง PASS
- [ ] **Step 7: Commit** `feat(admin): role guard and overview`

### Task 5: หน้าแอดมิน — ข้อความจากฟอร์มติดต่อ

**Files:**
- Create: `src/server/admin-messages.ts`, `src/server/schemas.ts`, `src/routes/admin.messages.tsx`
- Test: `src/server/schemas.test.ts`, `src/routes/admin.messages.test.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `logAction`, `StatusPill`
- Produces:
  - `messageStatusSchema = z.enum(['new','in_progress','done','spam'])`; `type MessageStatus = z.infer<typeof messageStatusSchema>`
  - `type Topic = 'ask_help' | 'refer' | 'report' | 'paid' | 'question'`; `type ContactMessage = { id: string; createdAt: string; topic: Topic; displayName: string | null; contact: string | null; message: string; billId: string | null; amount: number | null; status: MessageStatus; teamNote: string | null }`
  - `STATUS_LABELS: Record<MessageStatus, string>` = `new` "ใหม่", `in_progress` "กำลังดูแล", `done` "เสร็จแล้ว", `spam` "สแปม"
  - `updateMessageSchema = z.object({ id: z.string().uuid(), status: messageStatusSchema, teamNote: z.string().max(1000).nullable() })`
  - `listMessages({ status?: MessageStatus; before?: string /* ISO created_at */ })` → `{ items: ContactMessage[]; counts: Record<MessageStatus, number> }` เรียงใหม่→เก่า, หน้าละ 30
  - `updateMessage(input: z.infer<typeof updateMessageSchema>)` → `{ ok: true }`; เขียน `audit_log` action `message.update` พร้อม `{ from, to }`
  - `TOPIC_LABELS: Record<Topic, string>` = `ask_help` "ขอความช่วยเหลือเรื่องบิล", `refer` "แนะนำคนที่ต้องการความช่วยเหลือ", `report` "แจ้งเรื่องผิดปกติ", `paid` "แจ้งว่าโอนแล้ว", `question` "สอบถามเรื่องอื่น ๆ" (ตรงกับ `public/konlanid/app.js`)
- หน้า: ชิปกรองสถานะพร้อมจำนวน, การ์ดต่อข้อความ (หัวข้อ, เวลาแบบไทย, ชื่อเรียก, ช่องทางติดต่อ หรือ "ไม่ได้ให้ช่องทางติดต่อ", bill_id/ยอดถ้ามี, ข้อความเต็มตัดบรรทัดได้), เปลี่ยนสถานะ + โน้ตทีม + ปุ่มบันทึก, "ดูเพิ่ม" ใช้ `before`

- [ ] **Step 1: เทสต์ `schemas.test.ts`**: status `'archived'` ไม่ผ่าน; `teamNote` 1001 ตัวไม่ผ่าน; `id` ไม่ใช่ uuid ไม่ผ่าน; input ถูกต้องผ่าน
- [ ] **Step 2: เทสต์ `admin.messages.test.tsx`**: ข้อความ 2,000 ตัวอักษร + อีโมจิ + `contact=null` render ได้, เห็น "ไม่ได้ให้ช่องทางติดต่อ", การ์ดมี class ที่ตัดคำ (`break-words`); `updateMessage` reject → เห็น "บันทึกไม่สำเร็จ ลองอีกครั้งนะ" และโน้ตที่พิมพ์ยังอยู่; label หัวข้อตรง `TOPIC_LABELS`
- [ ] **Step 3:** Run `npx vitest run src/server/schemas.test.ts src/routes/admin.messages.test.tsx` · Expected: FAIL
- [ ] **Step 4:** Implement
- [ ] **Step 5:** Run เทสต์ + `npx tsc --noEmit -p .` · Expected: PASS
- [ ] **Step 6: ตรวจจริง** — ส่งข้อความผ่าน `public/konlanid` `#/contact` → ขึ้นใน `/admin/messages?status=new` → เปลี่ยนเป็น "กำลังดูแล" → แถวใน `audit_log` (ยืนยันในหน้าบันทึก Task 7); ที่ 390px ไม่มีเลื่อนแนวนอน
- [ ] **Step 7: Commit** `feat(admin): contact message inbox`

### Task 6: หน้าแอดมิน — จัดการทีม (owner เท่านั้น)

**Files:**
- Create: `src/server/admin-team.ts`, `src/routes/admin.team.tsx`
- Test: `src/server/admin-team.test.ts`

**Interfaces:**
- Consumes: `requireAdmin`, `logAction`, `Role`
- Produces:
  - `roleChangeError(actor: { userId: string; role: Role }, target: { userId: string; role: Role }, newRole: Role, ownerCount: number): string | null` — คืนข้อความไทยเมื่อไม่อนุญาต: actor ไม่ใช่ owner → "เฉพาะเจ้าของระบบที่จัดการทีมได้"; เปลี่ยนบทบาทตัวเอง → "เปลี่ยนบทบาทของตัวเองไม่ได้"; ทำให้ owner เหลือ 0 → "ต้องมีเจ้าของระบบอย่างน้อย 1 คน"; `newRole==='owner'` → "เพิ่มเจ้าของระบบผ่าน Lovable เท่านั้น"; อนุญาต → `null`
  - `listTeam()` → `{ userId, email, displayName, role }[]` (role admin/owner)
  - `setRole({ email: string; role: 'admin' | 'requester' })` → `{ ok: true } | { ok: false; message: string }`; หา user จากอีเมลด้วย `supabaseAdmin.auth.admin`, ไม่พบ → "ยังไม่มีบัญชีนี้ ให้เขาล็อกอินครั้งแรกก่อน"; สำเร็จเขียน `audit_log` `team.set_role`
- หน้า: รายชื่อทีม + ฟอร์มเพิ่มแอดมินด้วยอีเมล + ปุ่ม "เอาออกจากทีม" (ยืนยันก่อน); admin ที่ไม่ใช่ owner เห็นรายชื่ออย่างเดียว

- [ ] **Step 1: เทสต์ `admin-team.test.ts`** ครบทุกข้อความใน `roleChangeError` + กรณีอนุญาต (owner ตั้ง requester เป็น admin; owner ลด admin เป็น requester)
- [ ] **Step 2:** Run `npx vitest run src/server/admin-team.test.ts` · Expected: FAIL
- [ ] **Step 3:** Implement
- [ ] **Step 4:** Run เทสต์ + `npx tsc --noEmit -p .` · Expected: PASS
- [ ] **Step 5: ตรวจจริง** — owner เพิ่มแอดมินด้วยอีเมลบัญชีทดสอบ → บัญชีนั้นเข้า `/admin` ได้ → เอาออก → เข้าไม่ได้
- [ ] **Step 6: Commit** `feat(admin): team management`

### Task 7: หน้าแอดมิน — บันทึกการทำงาน

**Files:**
- Create: `src/server/admin-log.ts`, `src/routes/admin.log.tsx`
- Test: `src/server/admin-log.test.ts`

**Interfaces:**
- Consumes: `requireAdmin`
- Produces: `listAudit({ before?: number /* id */ })` → `{ items: { id, at, actorName, action, targetType, targetId, detail }[] }` หน้าละ 50; `describeAction(action: string, detail: Record<string, unknown>): string` — `message.update` → "เปลี่ยนสถานะข้อความจาก {from} เป็น {to}" (ใช้ label ไทยของสถานะ), `team.set_role` → "ตั้งบทบาท {email} เป็น {role}", อื่น ๆ → ชื่อ action ตรง ๆ
- หน้า: อ่านอย่างเดียว ไม่มีปุ่มแก้/ลบ

- [ ] **Step 1: เทสต์** `describeAction` สามกรณีข้างบน (สถานะ `new`→`in_progress` ได้ "เปลี่ยนสถานะข้อความจาก ใหม่ เป็น กำลังดูแล")
- [ ] **Step 2:** Run `npx vitest run src/server/admin-log.test.ts` · Expected: FAIL
- [ ] **Step 3:** Implement
- [ ] **Step 4:** Run `npx vitest run && npx tsc --noEmit -p . && npm run check:rls` · Expected: ทั้งหมด PASS
- [ ] **Step 5: Commit** `feat(admin): audit log view`
