# Nashville Scavenger Hunt — Payment setup checklist (Stripe)

Use this with your developer to turn on **live** booking payments on NashvilleScavengerHunt.com.

**How checkout works:** Customers pay on a secure **Stripe** page. Your site does **not** store card numbers. After payment, bookings confirm automatically and teams receive join codes.

---

## Part 1 — What David / the business completes in Stripe

### Step 1 — Create a Stripe account

1. Go to **https://dashboard.stripe.com/register**
2. Sign up with the **business email** you want for payouts and support.
3. Choose **United States** and business type (LLC, sole prop, etc.).

### Step 2 — Activate the account (Stripe “forms”)

In the Stripe Dashboard, complete **Settings → Business** and **Settings → Payments** until Stripe shows **Charges enabled** and **Payouts enabled**. You will typically need:

| Item | Notes |
|------|--------|
| Legal business name | As registered |
| DBA / brand name | e.g. Nashville Scavenger Hunt |
| EIN or SSN | For tax reporting (1099-K as applicable) |
| Business address | |
| Business phone / website | Use **https://nashvillescavengerhunt.com** (or your live domain) |
| Business description | e.g. “Walking scavenger hunt experiences in downtown Nashville” |
| **Bank account** | Checking account for **payouts** (routing + account number) |
| Identity verification | Photo ID for owner/representative if Stripe requests it |

**Do not email bank passwords or full card numbers to anyone.** Only enter bank details **inside Stripe**.

### Step 3 — Enable payment methods (Stripe Dashboard)

**Settings → Payment methods** (or **Checkout settings**):

| Method | Action |
|--------|--------|
| **Cards** (Visa, Mastercard, Amex, etc.) | Usually on by default |
| **Apple Pay** | Enable; Stripe handles registration when domain is verified |
| **Google Pay** | Enable |
| **Link** | Optional (Stripe’s saved payment) |
| **PayPal** | Enable only if shown in your Stripe region/plan; follow Stripe’s PayPal connect flow |
| **Venmo** | Not a separate Stripe Checkout toggle for most US setups; often via **PayPal / Braintree** if required later |

**Launch recommendation:** Cards + Apple Pay + Google Pay first. Add PayPal/Venmo in phase 2 if needed.

### Step 4 — Webhook (developer + David confirm domain)

After the site is on the **live domain**, the developer adds a webhook in Stripe:

- **URL:** `https://YOUR-LIVE-DOMAIN/api/webhooks/stripe`
- **Events (minimum):** `checkout.session.completed`, `charge.refunded`

Stripe shows a **Signing secret** (`whsec_...`) — send that to your developer securely (see Part 2).

---

## Part 2 — Information to send your developer (securely)

Send **test keys first**, then **live keys** when ready. Use a password manager share, encrypted email, or separate messages — not public chat.

### A) Business contact (for records)

| Field | Your answer |
|-------|-------------|
| Business legal name | |
| Public brand name | |
| Stripe account email | |
| Support email on site | |
| Support phone | |
| Live website URL | |

### B) Stripe API keys (from Dashboard → Developers → API keys)

| Key | Test mode value | Live mode value |
|-----|-----------------|-----------------|
| **Publishable key** (`pk_test_...` / `pk_live_...`) | | |
| **Secret key** (`sk_test_...` / `sk_live_...`) | | |
| **Webhook signing secret** (`whsec_...`) | | |

### C) Confirmation checklist

- [ ] Stripe Dashboard shows **Charges enabled**
- [ ] Stripe Dashboard shows **Payouts enabled**
- [ ] Bank account linked for payouts
- [ ] Test booking completed on **test keys** (developer)
- [ ] One small **live** test charge completed, then refunded if desired
- [ ] Apple Pay / Google Pay enabled (optional but recommended)

---

## Part 3 — What the developer configures on the server

Environment variables (production host, e.g. Vercel):

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://nashvillescavengerhunt.com
```

---

## Part 4 — Fees & timing (for your planning)

- Stripe charges **processing fees** per transaction (card rates apply; see Stripe pricing page).
- **Payouts** to your bank follow Stripe’s schedule (often 2 business days for US; first payout may take longer).
- Refunds are handled in Stripe Dashboard or via admin process; webhook keeps orders in sync.

---

## Questions?

Reply to your developer with **Part 2** filled in (especially test keys first). They will confirm when checkout is live.

*Document version: March 2026 — Nashville Scavenger Hunt project*
