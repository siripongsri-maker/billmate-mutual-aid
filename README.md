# BillMate Mutual Aid

Build BILLMATE, a beautiful mobile-first Thai/English interactive mutual aid bill-sharing prototype, fully navigable responsive web app. Brand: billmate. tagline 'Life happens. We help.' Warm inclusive contemporary fintech aesthetic, cream background, forest teal #087F70, coral accents, rounded cards, Thai-friendly typography. Default Thai with EN toggle. Screens: onboarding 3 steps; home dashboard with impact stats and featured verified bills; browse/search/filter bills; bill detail with progress and giver story; simulated contribute flow select amount 20/50/100/custom, confirmation and mock success impact receipt (NO actual payments); request help multi-step form with category, amount, due date, story, simulated document upload and privacy redaction preview, review, submit pending verification; my requests statuses; circles discovery, circle detail and join; footprint/impact; notifications; profile/settings/privacy; trust/how it works; corporate matching page; moderator dashboard with pending verification queue, approve/reject demo actions, dispute flags, metrics. Use realistic but clearly fictional sample data in THB. Role switch demo between helper, requester, moderator; persist local demo state if practical. Ensure navigation and buttons actually work, with back and empty/error states. Strong privacy: no actual ID docs, no real payments, no public addresses/account details, no promises that OCR proves authenticity. All sample verification badges clearly demo. Accessible high contrast, elegant microinteractions, mobile bottom navigation and desktop sidebar. Build polished working prototype, not just landing page. Include a visible DEMO banner and avoid any real fundraising or payment collection.

This project was built with [Lovable](https://lovable.dev).

## คนละนิด — ช่วยกันจ่ายบิลจริง

The Thai **Konlanid (คนละนิด)** site is in [`public/konlanid/`](public/konlanid/), and the site home page (`/`) redirects there. Helpers transfer to the **requester's own PromptPay account** with a QR that has the amount filled in (any Thai bank app). The team verifies the requester's identity (ID card + selfie), that the bill is current, in their name and at most one month overdue, and that the PromptPay account name matches. Once a bill is fully funded the requester pays it and sends the receipt within 7 days.

**Bills:** edit [`public/konlanid/data.js`](public/konlanid/data.js) — copy the commented template, fill in the real bill (including `pay.promptpay` and the verified `pay.accountName`), commit and push. Update `raised` and `helpers` as the requester confirms money received; set `status: 'paid'` once the receipt is checked.

**Contact form:** `#/contact` saves messages to the `contact_messages` table in Lovable Cloud ([migration](supabase/migrations/20261026120000_contact_messages.sql)). Anyone can send; nobody can read messages through the public API — the team reads them in Lovable Cloud.

A helper's own contributions and saved bills are kept only in their browser (`localStorage`). The illustrations were generated with GPT and are included as optimized WebP files.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0062d2d3-24a7-4a7e-8758-de368b750d3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
