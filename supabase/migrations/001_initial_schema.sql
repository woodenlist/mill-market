-- MillMarket initial schema
-- Run against a Supabase project with auth.users already provisioned.

-- =============================================================================
-- TABLES
-- =============================================================================

-- Companies ------------------------------------------------------------------
create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  ein         text,
  state       text,
  primary_role text,              -- 'mill' | 'supplier' | 'buyer'
  created_at  timestamptz not null default now()
);

-- Profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text,
  email       text,
  phone       text,
  company     text,
  company_id  uuid references public.companies on delete set null,
  roles       text[] not null default '{}',
  plan        text default 'free',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Mills ----------------------------------------------------------------------
create table if not exists public.mills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  state         text,
  city          text,
  verified      boolean not null default false,
  confidence    int default 0,
  accepting     boolean not null default true,
  quota_max     int,
  lat           double precision,
  lng           double precision,
  contact_name  text,
  contact_email text,
  contact_phone text,
  owner_id      uuid references public.profiles on delete set null,
  company_id    uuid references public.companies on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Mill rates (public rate history) -------------------------------------------
create table if not exists public.mill_rates (
  id            uuid primary key default gen_random_uuid(),
  mill_id       uuid not null references public.mills on delete cascade,
  species       text not null,
  rate          decimal(10,2) not null,
  op_type       text,              -- 'stumpage' | 'delivered' | 'gate'
  published_at  timestamptz not null default now(),
  published_by  uuid references public.profiles on delete set null
);

-- Supplier rates (private negotiated rates) ----------------------------------
create table if not exists public.supplier_rates (
  id                  uuid primary key default gen_random_uuid(),
  mill_id             uuid not null references public.mills on delete cascade,
  supplier_company_id uuid not null references public.companies on delete cascade,
  species             text not null,
  rate                decimal(10,2) not null,
  op_type             text,
  note                text,
  created_at          timestamptz not null default now(),
  created_by          uuid references public.profiles on delete set null
);

-- Mill quotas ----------------------------------------------------------------
create table if not exists public.mill_quotas (
  id          uuid primary key default gen_random_uuid(),
  mill_id     uuid not null references public.mills on delete cascade,
  max_tons    int not null default 0,
  accepting   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- Supplier quotas ------------------------------------------------------------
create table if not exists public.supplier_quotas (
  id                  uuid primary key default gen_random_uuid(),
  mill_id             uuid not null references public.mills on delete cascade,
  supplier_company_id uuid not null references public.companies on delete cascade,
  allocated_tons      int not null default 0,
  used_tons           int not null default 0,
  updated_at          timestamptz not null default now()
);

-- Job sites ------------------------------------------------------------------
create table if not exists public.job_sites (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  lat             double precision,
  lng             double precision,
  county          text,
  state           text,
  acres           decimal(10,2),
  species         text[] not null default '{}',
  estimated_tons  decimal(10,2),
  completed_tons  decimal(10,2) default 0,
  status          text default 'active',
  nearest_mill_id uuid references public.mills on delete set null,
  dist_to_mill    decimal(10,2),
  created_by      uuid references public.profiles on delete set null,
  company_id      uuid references public.companies on delete set null,
  shared_with     uuid[] not null default '{}',  -- array of profile uuids
  notes           text,
  created_at      timestamptz not null default now()
);

-- Tickets --------------------------------------------------------------------
create table if not exists public.tickets (
  id                uuid primary key default gen_random_uuid(),
  ticket_no         text,
  date              date not null default current_date,
  op_type           text,
  mill_id           uuid references public.mills on delete set null,
  species           text,
  scale_tons        decimal(10,4),
  mbf               decimal(10,4),
  rate              decimal(10,2),
  gross             decimal(12,2),
  status            text default 'draft',
  photo_url         text,
  photo_uploaded_at timestamptz,
  mill_verified     boolean not null default false,
  mill_verified_at  timestamptz,
  mill_verified_by  uuid references public.profiles on delete set null,
  job_site_id       uuid references public.job_sites on delete set null,
  submitted_by      uuid references public.profiles on delete set null,
  company_id        uuid references public.companies on delete set null,
  created_at        timestamptz not null default now()
);

-- Hauls ----------------------------------------------------------------------
create table if not exists public.hauls (
  id          uuid primary key default gen_random_uuid(),
  date        date not null default current_date,
  mill_id     uuid references public.mills on delete set null,
  op_type     text,
  species     text,
  tons        decimal(10,4),
  mbf         decimal(10,4),
  rate        decimal(10,2),
  gross       decimal(12,2),
  fuel        decimal(10,2),
  labor       decimal(10,2),
  mileage     int,
  net         decimal(12,2),
  job_site_id uuid references public.job_sites on delete set null,
  driver_id   uuid references public.profiles on delete set null,
  company_id  uuid references public.companies on delete set null,
  created_at  timestamptz not null default now()
);

-- Crew members ---------------------------------------------------------------
create table if not exists public.crew_members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles on delete set null,
  name        text not null,
  role        text,
  hourly      decimal(8,2),
  hours       decimal(8,2),
  status      text default 'active',
  machine     text,
  entity      text,
  phone       text,
  email       text,
  company_id  uuid references public.companies on delete set null,
  created_at  timestamptz not null default now()
);

-- Machines -------------------------------------------------------------------
create table if not exists public.machines (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text,
  make          text,
  year          int,
  assigned_to   uuid references public.crew_members on delete set null,
  hours         int default 0,
  next_service  int,
  status        text default 'active',
  company_id    uuid references public.companies on delete set null,
  created_at    timestamptz not null default now()
);

-- Alerts ---------------------------------------------------------------------
create table if not exists public.alerts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles on delete cascade,
  type        text,
  severity    text default 'info',
  title       text not null,
  body        text,
  resolved    boolean not null default false,
  read        boolean not null default false,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

-- Rate submissions -----------------------------------------------------------
create table if not exists public.rate_submissions (
  id            uuid primary key default gen_random_uuid(),
  mill_id       uuid not null references public.mills on delete cascade,
  species       text not null,
  rate          decimal(10,2) not null,
  op_type       text,
  submitted_by  uuid references public.profiles on delete set null,
  source        text,
  confidence    int default 0,
  status        text not null default 'pending',
  reviewed_by   uuid references public.profiles on delete set null,
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

-- =============================================================================
-- INDEXES
-- =============================================================================

create index if not exists idx_profiles_company_id     on public.profiles (company_id);
create index if not exists idx_mills_state             on public.mills (state);
create index if not exists idx_mill_rates_mill_id      on public.mill_rates (mill_id);
create index if not exists idx_supplier_rates_mill_id  on public.supplier_rates (mill_id);
create index if not exists idx_supplier_rates_supplier on public.supplier_rates (supplier_company_id);
create index if not exists idx_tickets_mill_id         on public.tickets (mill_id);
create index if not exists idx_tickets_submitted_by    on public.tickets (submitted_by);
create index if not exists idx_tickets_company_id      on public.tickets (company_id);
create index if not exists idx_hauls_company_id        on public.hauls (company_id);
create index if not exists idx_job_sites_company_id    on public.job_sites (company_id);
create index if not exists idx_alerts_user_id          on public.alerts (user_id);
create index if not exists idx_rate_submissions_mill   on public.rate_submissions (mill_id);
create index if not exists idx_supplier_quotas_mill    on public.supplier_quotas (mill_id);
create index if not exists idx_supplier_quotas_supplier on public.supplier_quotas (supplier_company_id);

-- =============================================================================
-- HELPER FUNCTION: get the company_id for the current auth user
-- =============================================================================

create or replace function public.current_user_company_id()
returns uuid
language sql
stable
security definer
as $$
  select company_id from public.profiles where id = auth.uid();
$$;

-- helper: check if current user owns a mill
create or replace function public.user_owns_mill(target_mill_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.mills
    where id = target_mill_id
      and (owner_id = auth.uid() or company_id = public.current_user_company_id())
  );
$$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on every table ---------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.companies        enable row level security;
alter table public.mills            enable row level security;
alter table public.mill_rates       enable row level security;
alter table public.supplier_rates   enable row level security;
alter table public.mill_quotas      enable row level security;
alter table public.supplier_quotas  enable row level security;
alter table public.tickets          enable row level security;
alter table public.job_sites        enable row level security;
alter table public.hauls            enable row level security;
alter table public.crew_members     enable row level security;
alter table public.machines         enable row level security;
alter table public.alerts           enable row level security;
alter table public.rate_submissions enable row level security;

-- PROFILES -------------------------------------------------------------------
-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- Company owners / admins can read profiles in their company
create policy "profiles_select_company"
  on public.profiles for select
  using (company_id = public.current_user_company_id() and public.current_user_company_id() is not null);

-- Users can update their own profile
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- Users can insert their own profile (signup)
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

-- COMPANIES ------------------------------------------------------------------
create policy "companies_select_own"
  on public.companies for select
  using (id = public.current_user_company_id());

create policy "companies_update_own"
  on public.companies for update
  using (id = public.current_user_company_id());

-- MILLS ----------------------------------------------------------------------
-- Any authenticated user can read mills
create policy "mills_select_authenticated"
  on public.mills for select
  using (auth.uid() is not null);

-- Mill owners can update their own mill
create policy "mills_update_owner"
  on public.mills for update
  using (owner_id = auth.uid() or company_id = public.current_user_company_id());

-- Mill owners can insert mills
create policy "mills_insert_authenticated"
  on public.mills for insert
  with check (auth.uid() is not null);

-- MILL RATES (public) --------------------------------------------------------
create policy "mill_rates_select_authenticated"
  on public.mill_rates for select
  using (auth.uid() is not null);

create policy "mill_rates_insert_mill_owner"
  on public.mill_rates for insert
  with check (public.user_owns_mill(mill_id));

-- SUPPLIER RATES (private — CRITICAL) ----------------------------------------
-- Only the mill owner OR the specific supplier company can see their rows.
create policy "supplier_rates_select_mill_owner"
  on public.supplier_rates for select
  using (public.user_owns_mill(mill_id));

create policy "supplier_rates_select_supplier"
  on public.supplier_rates for select
  using (supplier_company_id = public.current_user_company_id());

create policy "supplier_rates_insert_mill_owner"
  on public.supplier_rates for insert
  with check (public.user_owns_mill(mill_id));

create policy "supplier_rates_update_mill_owner"
  on public.supplier_rates for update
  using (public.user_owns_mill(mill_id));

-- MILL QUOTAS ----------------------------------------------------------------
create policy "mill_quotas_select_authenticated"
  on public.mill_quotas for select
  using (auth.uid() is not null);

create policy "mill_quotas_update_owner"
  on public.mill_quotas for update
  using (public.user_owns_mill(mill_id));

-- SUPPLIER QUOTAS ------------------------------------------------------------
-- Mill owner can read all quotas for their mill
create policy "supplier_quotas_select_mill_owner"
  on public.supplier_quotas for select
  using (public.user_owns_mill(mill_id));

-- Suppliers can read only their own allocation
create policy "supplier_quotas_select_supplier"
  on public.supplier_quotas for select
  using (supplier_company_id = public.current_user_company_id());

create policy "supplier_quotas_insert_mill_owner"
  on public.supplier_quotas for insert
  with check (public.user_owns_mill(mill_id));

create policy "supplier_quotas_update_mill_owner"
  on public.supplier_quotas for update
  using (public.user_owns_mill(mill_id));

-- TICKETS --------------------------------------------------------------------
-- Users can read their own company's tickets
create policy "tickets_select_company"
  on public.tickets for select
  using (company_id = public.current_user_company_id());

-- Mills can read tickets sent to them
create policy "tickets_select_mill"
  on public.tickets for select
  using (public.user_owns_mill(mill_id));

-- Users can insert tickets for their company
create policy "tickets_insert_company"
  on public.tickets for insert
  with check (company_id = public.current_user_company_id());

-- Users can update their own company's tickets
create policy "tickets_update_company"
  on public.tickets for update
  using (company_id = public.current_user_company_id());

-- Mills can update tickets sent to them (verification)
create policy "tickets_update_mill"
  on public.tickets for update
  using (public.user_owns_mill(mill_id));

-- JOB SITES ------------------------------------------------------------------
-- Owner company can see their sites
create policy "job_sites_select_company"
  on public.job_sites for select
  using (company_id = public.current_user_company_id());

-- Users the site is shared with can see it
create policy "job_sites_select_shared"
  on public.job_sites for select
  using (auth.uid() = any(shared_with));

-- Company members can insert sites
create policy "job_sites_insert_company"
  on public.job_sites for insert
  with check (company_id = public.current_user_company_id());

-- Company members can update their own sites
create policy "job_sites_update_company"
  on public.job_sites for update
  using (company_id = public.current_user_company_id());

-- HAULS ----------------------------------------------------------------------
create policy "hauls_select_company"
  on public.hauls for select
  using (company_id = public.current_user_company_id());

create policy "hauls_insert_company"
  on public.hauls for insert
  with check (company_id = public.current_user_company_id());

create policy "hauls_update_company"
  on public.hauls for update
  using (company_id = public.current_user_company_id());

-- CREW MEMBERS ---------------------------------------------------------------
create policy "crew_select_company"
  on public.crew_members for select
  using (company_id = public.current_user_company_id());

create policy "crew_insert_company"
  on public.crew_members for insert
  with check (company_id = public.current_user_company_id());

create policy "crew_update_company"
  on public.crew_members for update
  using (company_id = public.current_user_company_id());

-- MACHINES -------------------------------------------------------------------
create policy "machines_select_company"
  on public.machines for select
  using (company_id = public.current_user_company_id());

create policy "machines_insert_company"
  on public.machines for insert
  with check (company_id = public.current_user_company_id());

create policy "machines_update_company"
  on public.machines for update
  using (company_id = public.current_user_company_id());

-- ALERTS ---------------------------------------------------------------------
create policy "alerts_select_own"
  on public.alerts for select
  using (user_id = auth.uid());

create policy "alerts_update_own"
  on public.alerts for update
  using (user_id = auth.uid());

create policy "alerts_insert_system"
  on public.alerts for insert
  with check (auth.uid() is not null);

-- RATE SUBMISSIONS -----------------------------------------------------------
create policy "rate_submissions_select_own"
  on public.rate_submissions for select
  using (submitted_by = auth.uid());

create policy "rate_submissions_insert_authenticated"
  on public.rate_submissions for insert
  with check (auth.uid() is not null);

-- =============================================================================
-- TRIGGER: auto-update updated_at columns
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_mills_updated_at
  before update on public.mills
  for each row execute function public.set_updated_at();

-- =============================================================================
-- TRIGGER: auto-create profile on auth.users insert
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
