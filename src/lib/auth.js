import { supabase } from "./supabase";

/**
 * Register a new user with email and password.
 *
 * @param {string} email            - User email address.
 * @param {string} password         - Chosen password (min 6 chars enforced by Supabase).
 * @param {{ name?: string, company?: string, roles?: string[] }} [metadata]
 *   - Optional profile metadata stored in `raw_user_meta_data`.
 * @returns {Promise<import("@supabase/supabase-js").AuthResponse>}
 */
export async function signUp(email, password, metadata = {}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

/**
 * Sign in an existing user with email and password.
 *
 * @param {string} email    - User email address.
 * @param {string} password - Account password.
 * @returns {Promise<import("@supabase/supabase-js").AuthTokenResponsePassword>}
 */
export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign out the current user and clear the local session.
 *
 * @returns {Promise<{ error: import("@supabase/supabase-js").AuthError | null }>}
 */
export async function signOut() {
  return supabase.auth.signOut();
}

/**
 * Retrieve the current session (access token, user, etc.).
 * Returns `null` if no active session exists.
 *
 * @returns {Promise<import("@supabase/supabase-js").AuthSession | null>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Subscribe to auth state changes (sign-in, sign-out, token refresh).
 *
 * @param {(event: string, session: import("@supabase/supabase-js").AuthSession | null) => void} callback
 * @returns {{ data: { subscription: import("@supabase/supabase-js").Subscription } }}
 *   Call `subscription.unsubscribe()` to stop listening.
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Invite a user by email using the Supabase Admin API.
 * Requires the service role key — call this from a server context or
 * a Supabase Edge Function, NOT from the browser.
 *
 * @param {string} email - Email address to invite.
 * @param {string} role  - Application role to assign (stored in user metadata).
 * @returns {Promise<import("@supabase/supabase-js").AuthResponse>}
 */
export async function inviteUser(email, role) {
  // Build an admin client on the fly so the service role key never leaks to
  // the browser bundle. In practice this function should only be called from
  // a secure server environment (Edge Function, API route, etc.).
  const { createClient } = await import("@supabase/supabase-js");

  const secretKey = import.meta.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. " +
        "inviteUser must be called from a secure server context."
    );
  }

  const adminClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    secretKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  return adminClient.auth.admin.inviteUserByEmail(email, {
    data: { role },
  });
}
