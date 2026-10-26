// Checks what the public (publishable) key can and cannot do through the REST API.
// Usage: npm run check:rls   (reads VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY from .env)
//
// Every write probe below is one the policies must reject, so a passing run
// leaves no data behind. Never add a probe that is expected to succeed.
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

function loadEnv() {
  const path = fileURLToPath(new URL('../.env', import.meta.url))
  const env = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (!m) continue
    let v = m[2]
    if (/^(".*"|'.*')$/.test(v)) v = v.slice(1, -1)
    env[m[1]] = v
  }
  return env
}

const env = loadEnv()
const baseUrl = (process.env.VITE_SUPABASE_URL ?? env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''
if (!baseUrl || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env')
  process.exit(2)
}

// sb_publishable_ keys are not JWTs: send them as `apikey` only, never as a Bearer token.
async function call(method, path, { body, prefer } = {}) {
  const headers = { apikey: key }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (prefer) headers.Prefer = prefer
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    // not JSON; keep the raw text for the report
  }
  return { status: res.status, json, text, range: res.headers.get('content-range') }
}

const isEmptyList = (r) => r.status === 200 && Array.isArray(r.json) && r.json.length === 0
const code = (r) => r.json?.code ?? ''
const isDenied = (r) => (r.status === 401 || r.status === 403) && code(r) === '42501'

const checks = [
  {
    name: 'GET profiles returns [] or is denied (not 404)',
    run: () => call('GET', 'profiles?select=user_id'),
    pass: (r) => isEmptyList(r) || isDenied(r),
  },
  {
    name: 'GET settings returns [] or is denied (not 404)',
    run: () => call('GET', 'settings?select=key'),
    pass: (r) => isEmptyList(r) || isDenied(r),
  },
  {
    name: 'GET audit_log returns [] or is denied (not 404)',
    run: () => call('GET', 'audit_log?select=id'),
    pass: (r) => isEmptyList(r) || isDenied(r),
  },
  {
    name: 'POST profiles as owner is rejected (401/403, 42501)',
    run: () =>
      call('POST', 'profiles', { body: { user_id: randomUUID(), role: 'owner' }, prefer: 'return=minimal' }),
    pass: isDenied,
  },
  {
    name: 'GET contact_messages returns []',
    run: () => call('GET', 'contact_messages?select=id'),
    pass: isEmptyList,
  },
  {
    name: 'POST contact_messages with status done is rejected (42501)',
    run: () =>
      call('POST', 'contact_messages', {
        body: {
          topic: 'question',
          message: 'rls check: this row must be rejected',
          consent: true,
          status: 'done',
        },
        prefer: 'return=minimal',
      }),
    pass: isDenied,
  },
  {
    name: 'PATCH contact_messages changes no rows (content-range */0)',
    run: () =>
      call('PATCH', 'contact_messages?topic=eq.ask_help', {
        body: { status: 'done' },
        prefer: 'count=exact',
      }),
    pass: (r) => r.range === '*/0' && r.status < 300,
  },
  {
    name: 'DELETE contact_messages removes no rows (content-range */0)',
    run: () => call('DELETE', 'contact_messages?topic=eq.ask_help', { prefer: 'count=exact' }),
    pass: (r) => r.range === '*/0' && r.status < 300,
  },
]

let failed = 0
for (const check of checks) {
  let result
  try {
    result = await check.run()
  } catch (err) {
    failed++
    console.log(`FAIL  ${check.name}\n      request error: ${err.message}`)
    continue
  }
  if (check.pass(result)) {
    console.log(`PASS  ${check.name}`)
  } else {
    failed++
    const detail = result.json ? JSON.stringify(result.json) : result.text.slice(0, 200)
    console.log(
      `FAIL  ${check.name}\n      HTTP ${result.status}, content-range ${result.range ?? '-'}, ${detail}`,
    )
  }
}

console.log(failed ? `\n${failed} of ${checks.length} checks failed` : `\nAll ${checks.length} checks passed`)
process.exit(failed ? 1 : 0)
