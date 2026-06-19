# TODO

## Order success TOTAL AMOUNT wrong
- [ ] Identify how `order` data is persisted/loaded for `SuccessPage` (localStorage vs route state vs API)
- [ ] Fix `SuccessPage` to display correct total from reliable source (prefer Supabase order by order_number, or use navigate state)
- [ ] Ensure `CheckoutPage` stores the exact order payload/total used to create order (and not a stale cart total)
- [ ] Verify `OrderTrackingPage` reads the same source so totals match
- [ ] Test flow: add item(s) → checkout → success page shows correct total

