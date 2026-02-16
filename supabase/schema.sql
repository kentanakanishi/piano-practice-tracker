-- practice_entries テーブル
create table practice_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_date date not null,
  minutes smallint not null check (minutes >= 1 and minutes <= 480),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, practice_date)
);

-- ユーザーIDでの検索用インデックス
create index idx_practice_entries_user_id on practice_entries(user_id);

-- Row Level Security 有効化
alter table practice_entries enable row level security;

-- RLSポリシー: ユーザーは自分のデータのみ参照可能
create policy "Users can view own entries" on practice_entries
  for select using (auth.uid() = user_id);

-- RLSポリシー: ユーザーは自分のデータのみ挿入可能
create policy "Users can insert own entries" on practice_entries
  for insert with check (auth.uid() = user_id);

-- RLSポリシー: ユーザーは自分のデータのみ更新可能
create policy "Users can update own entries" on practice_entries
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLSポリシー: ユーザーは自分のデータのみ削除可能
create policy "Users can delete own entries" on practice_entries
  for delete using (auth.uid() = user_id);

-- updated_at 自動更新用トリガー関数
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger practice_entries_updated_at
  before update on practice_entries
  for each row execute function update_updated_at();
