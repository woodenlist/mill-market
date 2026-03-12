/**
 * Data layer — fetches from Supabase for real users, returns mock data for demo users.
 * All hooks return { data, loading, error, refetch } and manage their own state.
 */
import { useState, useEffect, useCallback, createContext, useContext } from "react";

// Demo user IDs (not UUIDs) — when we see these, serve mock data
const DEMO_IDS = new Set(["owner1","logger1","trucker1","mill1","admin1","contract1","new1"]);
export const isDemo = (userId) => DEMO_IDS.has(userId);

let _supabase = null;
async function sb() {
  if (!_supabase) {
    try {
      const mod = await import("./supabase.js");
      _supabase = mod.supabase;
    } catch {
      return null;
    }
  }
  return _supabase;
}

// ─── Generic fetch hook ───
function useSupaQuery(tableName, { userId, select = "*", filters = [], orderBy, mockData, transform, alwaysFallback = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const demo = isDemo(userId);
  const useFallback = demo || alwaysFallback;

  const refetch = useCallback(async () => {
    if (demo) {
      setData(mockData);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const client = await sb();
      if (!client) { setData(mockData); setLoading(false); return; }
      let q = client.from(tableName).select(select);
      for (const [method, ...args] of filters) {
        q = q[method](...args);
      }
      if (orderBy) q = q.order(orderBy.col, { ascending: orderBy.asc ?? false });
      const { data: rows, error: e } = await q;
      if (e) throw e;
      const result = transform ? transform(rows) : rows;
      setData(result && result.length > 0 ? result : (useFallback ? mockData : []));
    } catch (err) {
      setError(err);
      setData(useFallback ? mockData : []); // only demo users + global tables get mock fallback
    }
    setLoading(false);
  }, [demo, tableName, userId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data: data ?? (useFallback ? mockData : []), loading, error, refetch, setData };
}

// ─── DataContext ───
const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

export function DataProvider({ userId, children }) {
  return { userId, children }; // placeholder — actual provider built in App.jsx
}

// ─── Individual table hooks ───

export function useMills(userId, mockData) {
  return useSupaQuery("mills", {
    userId,
    select: "*, mill_rates(*)",
    mockData,
    alwaysFallback: true,
    transform: (rows) => rows.map(m => ({
      id: m.id,
      name: m.name,
      state: m.state,
      city: m.city,
      verified: m.verified,
      confidence: m.confidence,
      accepting: m.accepting,
      quotaMax: m.quota_max,
      lat: m.lat,
      lng: m.lng,
      contactName: m.contact_name,
      contactEmail: m.contact_email,
      contactPhone: m.contact_phone,
      rates: Object.fromEntries((m.mill_rates || []).map(r => [r.species, r.rate])),
    })),
  });
}

export function useTickets(userId, mockData) {
  return useSupaQuery("tickets", {
    userId,
    select: "*, mills(name), job_sites(name)",
    orderBy: { col: "created_at", asc: false },
    mockData,
    transform: (rows) => rows.map(t => ({
      id: t.id,
      no: t.ticket_no,
      date: t.date,
      opType: t.op_type,
      mill: t.mills?.name || "",
      species: t.species,
      scaleTons: t.scale_tons ? Number(t.scale_tons) : null,
      mbf: t.mbf ? Number(t.mbf) : null,
      rate: Number(t.rate || 0),
      gross: Number(t.gross || 0),
      status: t.status,
      photo: !!t.photo_url,
      photoUrl: t.photo_url,
      millVerified: t.mill_verified,
      jobSite: t.job_sites?.name || "",
      submittedBy: "You",
    })),
  });
}

export function useJobSites(userId, mockData) {
  return useSupaQuery("job_sites", {
    userId,
    mockData,
    transform: (rows) => rows.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      county: s.county,
      state: s.state,
      acres: s.acres ? Number(s.acres) : 0,
      species: s.species || [],
      estimatedTons: s.estimated_tons ? Number(s.estimated_tons) : 0,
      completedTons: s.completed_tons ? Number(s.completed_tons) : 0,
      status: s.status || "active",
      notes: s.notes,
    })),
  });
}

export function useHauls(userId, mockData) {
  return useSupaQuery("hauls", {
    userId,
    select: "*, mills(name), job_sites(name)",
    orderBy: { col: "date", asc: false },
    mockData,
    transform: (rows) => rows.map(h => ({
      id: h.id,
      date: h.date,
      mill: h.mills?.name || "",
      opType: h.op_type,
      species: h.species,
      tons: h.tons ? Number(h.tons) : null,
      mbf: h.mbf ? Number(h.mbf) : null,
      rate: Number(h.rate || 0),
      gross: Number(h.gross || 0),
      fuel: Number(h.fuel || 0),
      labor: Number(h.labor || 0),
      mileage: h.mileage || 0,
      net: Number(h.net || 0),
      jobSite: h.job_sites?.name || "",
    })),
  });
}

export function useCrew(userId, mockData) {
  return useSupaQuery("crew_members", {
    userId,
    mockData,
    transform: (rows) => rows.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      hourly: c.hourly ? Number(c.hourly) : null,
      hours: c.hours ? Number(c.hours) : 0,
      status: c.status || "active",
      machine: c.machine || "—",
      entity: c.entity || "",
      phone: c.phone,
      email: c.email,
    })),
  });
}

export function useAlerts(userId, mockData) {
  return useSupaQuery("alerts", {
    userId,
    filters: [["eq", "user_id", userId]],
    orderBy: { col: "created_at", asc: false },
    mockData,
    transform: (rows) => rows.map(a => ({
      id: a.id,
      type: a.type,
      severity: a.severity,
      title: a.title,
      body: a.body,
      time: timeAgo(a.created_at),
      read: a.read,
      resolved: a.resolved,
    })),
  });
}

export function useAllUsers(userId, mockData) {
  return useSupaQuery("profiles", {
    userId,
    mockData,
    transform: (rows) => rows.map(u => ({
      id: u.id,
      name: u.name || "",
      email: u.email || "",
      roles: u.roles || [],
      plan: u.plan || "free",
      company: u.company || "—",
      joined: u.created_at?.split("T")[0] || "",
      lastActive: "—",
      tickets: 0,
      status: "active",
    })),
  });
}

export function usePendingMills(userId, mockData) {
  return useSupaQuery("mills", {
    userId,
    filters: [["eq", "verified", false]],
    mockData,
    transform: (rows) => rows.map(m => ({
      id: m.id,
      name: m.name,
      state: m.state,
      city: m.city,
      contactName: m.contact_name,
      contactEmail: m.contact_email,
      contactPhone: m.contact_phone,
      submittedDate: m.created_at?.split("T")[0],
    })),
  });
}

export function usePendingRates(userId, mockData) {
  return useSupaQuery("rate_submissions", {
    userId,
    filters: [["eq", "status", "pending"]],
    orderBy: { col: "created_at", asc: false },
    mockData,
    transform: (rows) => rows.map(r => ({
      id: r.id,
      mill: r.mill_id,
      species: r.species,
      rate: Number(r.rate || 0),
      submittedBy: "User",
      date: r.created_at?.split("T")[0],
      source: r.source,
      confidence: r.confidence,
      opType: r.op_type,
    })),
  });
}

// ─── helpers ───
function timeAgo(isoStr) {
  if (!isoStr) return "";
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
