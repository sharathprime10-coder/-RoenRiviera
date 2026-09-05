-- 1. Create profiles table linked to Supabase auth.users
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS for profiles (optional, but good practice)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Add user_id to the existing documents table to scope uploads
alter table documents 
add column if not exists user_id uuid references auth.users;

-- 3. (Optional but recommended) Index the user_id for faster lookups
create index if not exists documents_user_id_idx on documents (user_id);
