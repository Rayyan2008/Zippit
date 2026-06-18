# Reset Dashboard - RPC follow-up

- [x] Identified current reset uses Supabase REST DELETE with filters; this causes either 400 UUID/null issues or no-op deletes.
- [ ] Create a Supabase RPC function (server-side SQL) to run: `DELETE FROM order_status_history;`
- [ ] Update `apps/web/src/lib/db.js` to call `supabase.rpc('reset_order_status_history')` (or configured function name).
- [ ] Verify reset clears dashboard history and refreshes stats.

