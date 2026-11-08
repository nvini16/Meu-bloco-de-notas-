create index notes_category_owner_fk_idx
  on public.notes (category_id, user_id)
  where category_id is not null;
