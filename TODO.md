# TODO

- [x] Inspect dashboard reset UI and existing `resetDashboardData()` implementation.
- [x] Fix Supabase `order_status_history` deletion to include a required WHERE/Filter clause (prevents 400 Bad Request).
- [ ] Smoke test: open Admin Dashboard and trigger “Reset dashboard”; confirm history is cleared and orders/inquiries remain.
- [ ] (Optional) Tighten filter if you know the exact primary key/columns of `order_status_history`.

