# Making LaunchKit Sellable — Stripe Setup

The app is already wired for one-time pack sales. The only missing piece is
your Stripe account and four Payment Links. Nobody can do this part for you:
Stripe requires identity verification and your bank details.

## Step 1 — Create the Stripe account (~10 min)

1. Go to https://dashboard.stripe.com/register
2. Sign up with your business email.
3. Complete activation: business details (sole proprietor is fine), your
   identity, and the bank account payouts go to.
4. Until activation completes you are in **test mode** — that is fine for now;
   flip to **live mode** when you are ready to take real money.

## Step 2 — Create four Payment Links (~10 min)

In the Dashboard: **Payments → Payment Links → Create payment link**.
Create one per pack (all one-time payments, USD):

| Pack     | Price | After-payment redirect URL (paste exactly)                          |
|----------|-------|---------------------------------------------------------------------|
| Starter  | $49   | `https://or4cl3-ai-1.github.io/launchkit/?purchased=starter`        |
| Pro      | $99   | `https://or4cl3-ai-1.github.io/launchkit/?purchased=pro`            |
| Complete | $199  | `https://or4cl3-ai-1.github.io/launchkit/?purchased=complete`        |
| Refresh  | $29   | `https://or4cl3-ai-1.github.io/launchkit/?purchased=refresh`        |

For each link:
- Product name: e.g. "LaunchKit Starter Pack" (one-time, $49 USD).
- Under **After payment**, choose **Redirect to your website** and paste the
  URL from the table. (Do *not* use the default Stripe confirmation page —
  the app unlocks the pack from that redirect.)
- Collect the buyer's email (on by default) so you have a customer record.
- Copy the finished Payment Link URL (looks like
  `https://buy.stripe.com/....`).

Test it first: in test mode, pay with card `4242 4242 4242 4242`, any future
date, any CVC. You should land back on the LaunchKit page and see the
"Pack unlocked" toast.

## Step 3 — Wire the links into the app

Send the four Payment Link URLs to your assistant (or edit
`src/lib/packs.ts` yourself — the `stripeLink` field on each pack), then
rebuild and redeploy. The buy buttons go live immediately.

## How the v1 purchase flow works

1. Buyer clicks **Buy** on the landing page → Stripe-hosted checkout.
2. Stripe redirects back to `?purchased=<pack>` → the app unlocks that pack's
   export (stored in the browser's localStorage).
3. Markdown pack export is gated: locked sections trigger an upsell dialog
   naming the cheapest pack that covers them. JSON backup export stays free.

## Honest limitations of v1 (read before launch)

- **Unlock is device-local.** Buying on a phone does not unlock the desktop
  browser. Note this on the pricing page if it becomes a support issue.
- **The success redirect is unsigned.** A technical user could visit the
  success URL without paying. For the first dollars this is an acceptable
  tradeoff; when volume justifies it, add a tiny backend that verifies
  Stripe webhook signatures and issues license keys.
- **Fees:** Stripe takes 2.9% + $0.30 per transaction. A $49 pack nets ~$47.28.
- **Tax:** Stripe Tax is off by default. For US-only early sales this is
  usually fine, but it is your responsibility — consider enabling Stripe Tax
  on the payment links once sales are real.
- **Refunds/disputes** are handled in the Stripe Dashboard. Digital goods
  have weak chargeback protection; keep the per-pack prices where they are
  and respond to any dispute within the deadline.
