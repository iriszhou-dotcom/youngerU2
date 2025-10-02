@@ .. @@
 -- Community Q&A tables
 create table if not exists public.questions (
   id serial primary key,
   user_id uuid references auth.users(id) on delete cascade not null,
   title text not null,
   body text not null,
   tags text[] default '{}',
+  likes_count integer default 0,
+  answers_count integer default 0,
+  is_saved boolean default false,
   created_at timestamptz default now()
 );

 create table if not exists public.answers (
   id serial primary key,
   question_id integer references public.questions(id) on delete cascade not null,
   user_id uuid references auth.users(id) on delete cascade not null,
   body text not null,
   is_expert boolean default false,
+  likes_count integer default 0,
   created_at timestamptz default now()
 );

+-- Question likes table
+create table if not exists public.question_likes (
+  id serial primary key,
+  question_id integer references public.questions(id) on delete cascade not null,
+  user_id uuid references auth.users(id) on delete cascade not null,
+  created_at timestamptz default now(),
+  unique(question_id, user_id)
+);
+
+-- Answer likes table
+create table if not exists public.answer_likes (
+  id serial primary key,
+  answer_id integer references public.answers(id) on delete cascade not null,
+  user_id uuid references auth.users(id) on delete cascade not null,
+  created_at timestamptz default now(),
+  unique(answer_id, user_id)
+);
+
+-- Saved questions table
+create table if not exists public.saved_questions (
+  id serial primary key,
+  question_id integer references public.questions(id) on delete cascade not null,
+  user_id uuid references auth.users(id) on delete cascade not null,
+  created_at timestamptz default now(),
+  unique(question_id, user_id)
+);

 -- Enable RLS
 alter table public.questions enable row level security;
 alter table public.answers enable row level security;
+alter table public.question_likes enable row level security;
+alter table public.answer_likes enable row level security;
+alter table public.saved_questions enable row level security;

 -- RLS Policies for questions
 create policy "Anyone can read questions"
@@ .. @@
 create policy "Users can insert own answers"
   on public.answers for insert
   to authenticated
   with check (auth.uid() = user_id);

+-- RLS Policies for question_likes
+create policy "Anyone can read question likes"
+  on public.question_likes for select
+  to anon, authenticated
+  using (true);
+
+create policy "Users can insert own question likes"
+  on public.question_likes for insert
+  to authenticated
+  with check (auth.uid() = user_id);
+
+create policy "Users can delete own question likes"
+  on public.question_likes for delete
+  to authenticated
+  using (auth.uid() = user_id);
+
+-- RLS Policies for answer_likes
+create policy "Anyone can read answer likes"
+  on public.answer_likes for select
+  to anon, authenticated
+  using (true);
+
+create policy "Users can insert own answer likes"
+  on public.answer_likes for insert
+  to authenticated
+  with check (auth.uid() = user_id);
+
+create policy "Users can delete own answer likes"
+  on public.answer_likes for delete
+  to authenticated
+  using (auth.uid() = user_id);
+
+-- RLS Policies for saved_questions
+create policy "Users can read own saved questions"
+  on public.saved_questions for select
+  to authenticated
+  using (auth.uid() = user_id);
+
+create policy "Users can insert own saved questions"
+  on public.saved_questions for insert
+  to authenticated
+  with check (auth.uid() = user_id);
+
+create policy "Users can delete own saved questions"
+  on public.saved_questions for delete
+  to authenticated
+  using (auth.uid() = user_id);
+
+-- Functions to update counts
+create or replace function update_question_likes_count()
+returns trigger as $$
+begin
+  if TG_OP = 'INSERT' then
+    update public.questions 
+    set likes_count = likes_count + 1 
+    where id = NEW.question_id;
+    return NEW;
+  elsif TG_OP = 'DELETE' then
+    update public.questions 
+    set likes_count = likes_count - 1 
+    where id = OLD.question_id;
+    return OLD;
+  end if;
+  return null;
+end;
+$$ language plpgsql;
+
+create or replace function update_question_answers_count()
+returns trigger as $$
+begin
+  if TG_OP = 'INSERT' then
+    update public.questions 
+    set answers_count = answers_count + 1 
+    where id = NEW.question_id;
+    return NEW;
+  elsif TG_OP = 'DELETE' then
+    update public.questions 
+    set answers_count = answers_count - 1 
+    where id = OLD.question_id;
+    return OLD;
+  end if;
+  return null;
+end;
+$$ language plpgsql;
+
+create or replace function update_answer_likes_count()
+returns trigger as $$
+begin
+  if TG_OP = 'INSERT' then
+    update public.answers 
+    set likes_count = likes_count + 1 
+    where id = NEW.answer_id;
+    return NEW;
+  elsif TG_OP = 'DELETE' then
+    update public.answers 
+    set likes_count = likes_count - 1 
+    where id = OLD.answer_id;
+    return OLD;
+  end if;
+  return null;
+end;
+$$ language plpgsql;
+
+-- Triggers
+create trigger question_likes_count_trigger
+  after insert or delete on public.question_likes
+  for each row execute function update_question_likes_count();
+
+create trigger question_answers_count_trigger
+  after insert or delete on public.answers
+  for each row execute function update_question_answers_count();
+
+create trigger answer_likes_count_trigger
+  after insert or delete on public.answer_likes
+  for each row execute function update_answer_likes_count();

 -- Sample questions data