# BillMate Mutual Aid

Build BILLMATE, a beautiful mobile-first Thai/English interactive mutual aid bill-sharing prototype, fully navigable responsive web app. Brand: billmate. tagline 'Life happens. We help.' Warm inclusive contemporary fintech aesthetic, cream background, forest teal #087F70, coral accents, rounded cards, Thai-friendly typography. Default Thai with EN toggle. Screens: onboarding 3 steps; home dashboard with impact stats and featured verified bills; browse/search/filter bills; bill detail with progress and giver story; simulated contribute flow select amount 20/50/100/custom, confirmation and mock success impact receipt (NO actual payments); request help multi-step form with category, amount, due date, story, simulated document upload and privacy redaction preview, review, submit pending verification; my requests statuses; circles discovery, circle detail and join; footprint/impact; notifications; profile/settings/privacy; trust/how it works; corporate matching page; moderator dashboard with pending verification queue, approve/reject demo actions, dispute flags, metrics. Use realistic but clearly fictional sample data in THB. Role switch demo between helper, requester, moderator; persist local demo state if practical. Ensure navigation and buttons actually work, with back and empty/error states. Strong privacy: no actual ID docs, no real payments, no public addresses/account details, no promises that OCR proves authenticity. All sample verification badges clearly demo. Accessible high contrast, elegant microinteractions, mobile bottom navigation and desktop sidebar. Build polished working prototype, not just landing page. Include a visible DEMO banner and avoid any real fundraising or payment collection.

This project was built with [Lovable](https://lovable.dev).

## คนละนิด — ช่วยกันจ่ายบิลจริง

The live Thai **Konlanid (คนละนิด)** site is in [`public/konlanid/`](public/konlanid/), and the site home page (`/`) redirects there. Helpers pay the bill's provider directly from their bank app (the money never passes through the requester or the team), then send their slip to the team.

**Adding or updating a bill:** edit [`public/konlanid/data.js`](public/konlanid/data.js) — copy the commented template, fill in the real bill, commit and push. After checking slips, update `raised` and `helpers`; set `status: 'paid'` once the bill is fully paid. Set `contact.url` to the team's LINE OA or Messenger link so helpers can send slips.

Only two kinds of bill are accepted: bills that can be paid in parts (test with a ฿20 payment, then set `splittable: true` — bills without it are not listed), and bills no more than one month overdue (bills over 30 days past due close automatically). Get the requester's consent for what is shown and never publish real names or addresses.

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
