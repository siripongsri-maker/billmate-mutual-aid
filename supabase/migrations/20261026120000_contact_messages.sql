-- Messages sent from the public คนละนิด contact form (public/konlanid, route #/contact).
-- Anyone can send; nobody can read them through the public API. The team reads them
-- in Lovable Cloud (and later in the admin pages).
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  topic text not null check (topic in ('ask_help', 'refer', 'report', 'paid', 'question')),
  display_name text check (char_length(display_name) <= 80),
  contact text check (char_length(contact) <= 120),
  message text not null check (char_length(message) between 5 and 2000),
  bill_id text check (char_length(bill_id) <= 60),
  amount numeric(10, 2) check (amount is null or (amount > 0 and amount < 1000000)),
  consent boolean not null check (consent),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'spam')),
  team_note text
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (status = 'new' and team_note is null);

grant insert on public.contact_messages to anon, authenticated;
