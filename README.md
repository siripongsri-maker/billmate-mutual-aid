# BillMate Mutual Aid

Build BILLMATE, a beautiful mobile-first Thai/English interactive mutual aid bill-sharing prototype, fully navigable responsive web app. Brand: billmate. tagline 'Life happens. We help.' Warm inclusive contemporary fintech aesthetic, cream background, forest teal #087F70, coral accents, rounded cards, Thai-friendly typography. Default Thai with EN toggle. Screens: onboarding 3 steps; home dashboard with impact stats and featured verified bills; browse/search/filter bills; bill detail with progress and giver story; simulated contribute flow select amount 20/50/100/custom, confirmation and mock success impact receipt (NO actual payments); request help multi-step form with category, amount, due date, story, simulated document upload and privacy redaction preview, review, submit pending verification; my requests statuses; circles discovery, circle detail and join; footprint/impact; notifications; profile/settings/privacy; trust/how it works; corporate matching page; moderator dashboard with pending verification queue, approve/reject demo actions, dispute flags, metrics. Use realistic but clearly fictional sample data in THB. Role switch demo between helper, requester, moderator; persist local demo state if practical. Ensure navigation and buttons actually work, with back and empty/error states. Strong privacy: no actual ID docs, no real payments, no public addresses/account details, no promises that OCR proves authenticity. All sample verification badges clearly demo. Accessible high contrast, elegant microinteractions, mobile bottom navigation and desktop sidebar. Build polished working prototype, not just landing page. Include a visible DEMO banner and avoid any real fundraising or payment collection.

This project was built with [Lovable](https://lovable.dev).

## คนละนิด — interactive visual concept

The standalone Thai **Konlanid (คนละนิด)** concept is in [`public/konlanid/`](public/konlanid/). It includes the warm illustrated interface, bill discovery and detail screens, amount selection and review, contribution tracking, a sample request flow, and reporting/pause states.

With the development server running, open **`/konlanid/index.html`**. You can also open `public/konlanid/index.html` directly in a browser. Keep `style.css`, `app.js`, and the `assets/` folder alongside it.

All people, bills, verification, contributions, and payment confirmations are fictional demo data. There are no real payments, identity checks, document uploads, or biller integrations. Demo changes live in memory and reset when the page reloads. The transparent illustrations were generated with GPT and are included as optimized WebP files.

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
