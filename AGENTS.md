<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!-- LOVABLE:BEGIN_AGENTS -->
> [!IMPORTANT]
> The product name is defined once in `src/lib/brand.ts` and read from there by the
> logo and page titles, so a rename stays a one-file change.
<!-- LOVABLE:END_AGENTS -->


- AI story drafting uses an authenticated server function with validated input, explicit consent, no app persistence, and editable output; keep real details out of demo storage and public fundraising.
- The standalone request page links to a TanStack drafting route; AI SDK imports stay inside server handlers so secrets and SDK runtime never enter browser bundles.
- Traffic analytics uses a cookieless same-origin write-only collector and daily category counters; authenticated reads require protected user_roles, so user-editable profiles cannot grant analytics access. Existing staff roles are backfilled only by migration; grant future analytics staff through protected role administration.
