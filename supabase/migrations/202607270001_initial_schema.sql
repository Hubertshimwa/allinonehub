-- Allinonehub core schema. Run this migration in a new Supabase project.
create extension if not exists pgcrypto;

create type public.user_role as enum ('member', 'author', 'moderator', 'editor', 'administrator', 'super_admin');
create type public.content_status as enum ('draft', 'pending', 'published', 'rejected', 'archived');
create type public.opportunity_type as enum ('scholarship', 'job', 'internship', 'program', 'volunteer', 'event', 'grant');
create type public.notification_kind as enum ('opportunity', 'comment', 'message', 'achievement', 'system');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Member' check (char_length(full_name) between 1 and 100),
  username text unique check (username ~ '^[a-z0-9_]{3,30}$'),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  location text check (char_length(location) <= 120),
  interests text[] not null default '{}',
  role public.user_role not null default 'member',
  is_profile_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,50}$'),
  name text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,160}$'),
  title text not null check (char_length(title) between 5 and 180),
  organization text not null check (char_length(organization) between 2 and 160),
  type public.opportunity_type not null,
  description text not null check (char_length(description) between 30 and 10000),
  url text not null check (url ~ '^https?://'),
  location text,
  eligibility text,
  deadline timestamptz,
  tags text[] not null default '{}',
  image_url text,
  is_featured boolean not null default false,
  status public.content_status not null default 'pending',
  submitted_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index opportunities_public_idx on public.opportunities (status, deadline asc nulls last, published_at desc);
create index opportunities_search_idx on public.opportunities using gin (to_tsvector('simple', title || ' ' || organization || ' ' || coalesce(description, '')));

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,160}$'),
  title text not null check (char_length(title) between 5 and 180),
  excerpt text check (char_length(excerpt) <= 500),
  body text not null,
  cover_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid not null references public.profiles(id) on delete restrict,
  status public.content_status not null default 'draft',
  read_time_minutes smallint check (read_time_minutes between 1 and 120),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_public_idx on public.articles (status, published_at desc);

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_item_target check (num_nonnulls(opportunity_id, article_id) = 1)
);
create unique index saved_opportunity_unique on public.saved_items (user_id, opportunity_id) where opportunity_id is not null;
create unique index saved_article_unique on public.saved_items (user_id, article_id) where article_id is not null;

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  name text not null check (char_length(name) between 3 and 100),
  description text,
  image_url text,
  is_private boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_moderator boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete set null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index community_posts_feed_idx on public.community_posts (community_id, created_at desc) where status = 'published';
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.post_comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.post_reactions (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null default '❤️' check (char_length(emoji) <= 16),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, emoji)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  is_group boolean not null default false,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index messages_conversation_idx on public.messages (conversation_id, created_at desc);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_image_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  body text not null,
  position integer not null check (position > 0),
  duration_minutes smallint check (duration_minutes between 1 and 240),
  created_at timestamptz not null default now(),
  unique (course_id, position)
);
create table public.learning_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  icon text,
  created_at timestamptz not null default now()
);
create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind public.notification_kind not null,
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create table public.push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('web', 'android', 'ios', 'desktop')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 1000),
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.post_comments(id) on delete cascade,
  status public.content_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint report_target check (num_nonnulls(post_id, comment_id) = 1)
);
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and email ~ '^[^@]+@[^@]+\\.[^@]+$'),
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name) values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, 'member'), '@', 1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$ select coalesce((select role in ('moderator', 'editor', 'administrator', 'super_admin') from public.profiles where id = auth.uid()), false); $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select coalesce((select role in ('administrator', 'super_admin') from public.profiles where id = auth.uid()), false); $$;
create or replace function public.is_conversation_member(target_conversation_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.conversation_members where conversation_id = target_conversation_id and user_id = auth.uid()); $$;
create or replace function public.protect_profile_role() returns trigger language plpgsql security definer set search_path = public as $$ begin if new.role <> old.role and not public.is_admin() then raise exception 'Only administrators can change roles'; end if; return new; end; $$;

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger opportunities_updated_at before update on public.opportunities for each row execute procedure public.set_updated_at();
create trigger articles_updated_at before update on public.articles for each row execute procedure public.set_updated_at();
create trigger posts_updated_at before update on public.community_posts for each row execute procedure public.set_updated_at();
create trigger courses_updated_at before update on public.courses for each row execute procedure public.set_updated_at();
create trigger conversations_updated_at before update on public.conversations for each row execute procedure public.set_updated_at();
create trigger push_devices_updated_at before update on public.push_devices for each row execute procedure public.set_updated_at();
create trigger newsletter_updated_at before update on public.newsletter_subscribers for each row execute procedure public.set_updated_at();
create trigger prevent_role_change before update on public.profiles for each row execute procedure public.protect_profile_role();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.opportunities enable row level security;
alter table public.articles enable row level security;
alter table public.saved_items enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.learning_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.notifications enable row level security;
alter table public.push_devices enable row level security;
alter table public.reports enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Public profiles are visible" on public.profiles for select using (is_profile_public or id = auth.uid() or public.is_staff());
create policy "Members update own profile" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "Categories readable" on public.categories for select using (true);
create policy "Staff manage categories" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "Published opportunities readable" on public.opportunities for select using (status = 'published' or submitted_by = auth.uid() or public.is_staff());
create policy "Members submit opportunities" on public.opportunities for insert with check (submitted_by = auth.uid() and status = 'pending');
create policy "Submitters update pending opportunities" on public.opportunities for update using (submitted_by = auth.uid() and status = 'pending') with check (submitted_by = auth.uid() and status = 'pending');
create policy "Staff manage opportunities" on public.opportunities for all using (public.is_staff()) with check (public.is_staff());
create policy "Published articles readable" on public.articles for select using (status = 'published' or author_id = auth.uid() or public.is_staff());
create policy "Authors create articles" on public.articles for insert with check (author_id = auth.uid());
create policy "Authors manage drafts" on public.articles for update using (author_id = auth.uid() or public.is_staff()) with check (author_id = auth.uid() or public.is_staff());
create policy "Saved items belong to member" on public.saved_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Public communities readable" on public.communities for select using (not is_private or exists (select 1 from public.community_members where community_id = id and user_id = auth.uid()) or public.is_staff());
create policy "Authenticated users join public groups" on public.community_members for insert with check (user_id = auth.uid());
create policy "Members see their memberships" on public.community_members for select using (user_id = auth.uid() or public.is_staff());
create policy "Members leave groups" on public.community_members for delete using (user_id = auth.uid() or public.is_staff());
create policy "Published posts readable" on public.community_posts for select using (status = 'published' or author_id = auth.uid() or public.is_staff());
create policy "Members create posts" on public.community_posts for insert with check (author_id = auth.uid());
create policy "Authors edit posts" on public.community_posts for update using (author_id = auth.uid() or public.is_staff()) with check (author_id = auth.uid() or public.is_staff());
create policy "Authors delete posts" on public.community_posts for delete using (author_id = auth.uid() or public.is_staff());
create policy "Comments readable" on public.post_comments for select using (true);
create policy "Members create comments" on public.post_comments for insert with check (author_id = auth.uid());
create policy "Authors manage comments" on public.post_comments for all using (author_id = auth.uid() or public.is_staff()) with check (author_id = auth.uid() or public.is_staff());
create policy "Reactions readable" on public.post_reactions for select using (true);
create policy "Members manage own reactions" on public.post_reactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Conversation members read conversations" on public.conversations for select using (public.is_conversation_member(id));
create policy "Members read conversation membership" on public.conversation_members for select using (user_id = auth.uid() or public.is_conversation_member(conversation_id));
create policy "Conversation members read messages" on public.messages for select using (public.is_conversation_member(conversation_id));
create policy "Conversation members send messages" on public.messages for insert with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));
create policy "Published courses readable" on public.courses for select using (status = 'published' or public.is_staff());
create policy "Staff manage courses" on public.courses for all using (public.is_staff()) with check (public.is_staff());
create policy "Lessons readable with course" on public.lessons for select using (exists (select 1 from public.courses where id = course_id and (status = 'published' or public.is_staff())));
create policy "Staff manage lessons" on public.lessons for all using (public.is_staff()) with check (public.is_staff());
create policy "Users manage own progress" on public.learning_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Achievements readable" on public.achievements for select using (true);
create policy "Staff manage achievements" on public.achievements for all using (public.is_staff()) with check (public.is_staff());
create policy "User achievements readable" on public.user_achievements for select using (true);
create policy "Staff award achievements" on public.user_achievements for insert with check (public.is_staff());
create policy "Users read own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage their push devices" on public.push_devices for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Members make reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "Members see own reports" on public.reports for select using (reporter_id = auth.uid() or public.is_staff());
create policy "Staff manage reports" on public.reports for update using (public.is_staff()) with check (public.is_staff());
-- Newsletter writes occur only through the service-role API route. No browser policy is intentionally granted.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']) on conflict (id) do nothing;
create policy "Avatar images are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

insert into public.categories (slug, name, description, icon) values
  ('scholarships', 'Scholarships', 'Funding for learning', 'graduation-cap'),
  ('jobs', 'Jobs', 'Remote jobs and internships', 'briefcase'),
  ('learning', 'Learning', 'Courses and useful resources', 'book-open'),
  ('technology', 'Technology', 'Practical digital skills', 'code-2'),
  ('business', 'Business', 'Ideas, startups, and growth', 'rocket'),
  ('community', 'Community', 'People moving forward together', 'users')
on conflict (slug) do nothing;
