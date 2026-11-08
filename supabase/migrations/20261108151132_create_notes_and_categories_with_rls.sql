create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#EAF3FF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_length check (char_length(btrim(name)) between 1 and 40),
  constraint categories_color_hex check (color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint categories_id_user_unique unique (id, user_id)
);

create unique index categories_user_name_unique
  on public.categories (user_id, lower(name));

create index categories_user_created_idx
  on public.categories (user_id, created_at desc);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid,
  title text not null default 'Sem título',
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint notes_title_length check (char_length(title) <= 160),
  constraint notes_content_object check (jsonb_typeof(content) = 'object'),
  constraint notes_category_owner_fk
    foreign key (category_id, user_id)
    references public.categories (id, user_id)
    on delete set null (category_id)
);

create index notes_user_updated_idx
  on public.notes (user_id, updated_at desc)
  where deleted_at is null;

create index notes_user_deleted_idx
  on public.notes (user_id, deleted_at desc)
  where deleted_at is not null;

create index notes_user_favorites_idx
  on public.notes (user_id, updated_at desc)
  where is_favorite = true and deleted_at is null;

create index notes_user_category_idx
  on public.notes (user_id, category_id)
  where deleted_at is null;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function private.set_updated_at();

create trigger notes_set_updated_at
before update on public.notes
for each row execute function private.set_updated_at();

alter table public.categories enable row level security;
alter table public.notes enable row level security;

create policy "Users can read their own categories"
  on public.categories for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own categories"
  on public.categories for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own categories"
  on public.categories for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own notes"
  on public.notes for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own notes"
  on public.notes for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own notes"
  on public.notes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.categories, public.notes from anon, authenticated, service_role;
grant select, insert, update, delete on table public.categories, public.notes to authenticated, service_role;
