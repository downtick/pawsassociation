# Supabase auth email templates

Supabase — not this app — sends the magic-link, signup-confirmation, and
password-reset emails. Out of the box they come from Supabase's own address
with Supabase's own wording, which is why they look nothing like the site.

Two settings fix that, both under **Authentication** in the Supabase dashboard:

## 1. URL Configuration  (fixes links pointing at localhost)

- **Site URL**: `https://pawsassociation.com`
- **Redirect URLs** (allow-list — add all of these):
  - `https://pawsassociation.com/**`
  - `https://*.vercel.app/**`      ← preview deploys
  - `http://localhost:3000/**`     ← local development

The app already asks for `${window.location.origin}/auth/callback`. If that
exact origin is not in the allow-list, **Supabase silently ignores it and
falls back to Site URL** — which ships as `http://localhost:3000`. That silent
fallback is why a link in a real email can land on localhost.

## 2. SMTP Settings  (fixes the sender address and lets templates through)

Supabase's built-in email sender is for development only: it is rate-limited
to a handful of messages per hour and always sends from a Supabase address.
Point it at SMTP2GO instead:

- Host: `mail.smtp2go.com`
- Port: `587`  (or `2525` if 587 is blocked)
- Username / password: from SMTP2GO → **SMTP Users** — these are NOT the same
  as the API key the app uses for its own mail
- Sender email: `office@pawsassociation.com`
- Sender name: `PAWS`

Verify the sending domain (SPF + DKIM) in SMTP2GO before switching this on.

## 3. Templates

Paste each file in this folder into Authentication → Emails → the matching
template. Supabase fills in `{{ .SiteURL }}` and `{{ .TokenHash }}` itself —
leave those tokens exactly as written.

The links deliberately do NOT use `{{ .ConfirmationURL }}`. That one-click
link is consumed by corporate mail scanners (Microsoft 365 Safe Links opened
the owner's first confirmation link 26 seconds after it was sent, from a
Microsoft IP), so members on business email got "link expired". Instead each
link opens `/auth/confirm` on the site, which only spends the token when a
person presses the button. Site URL in Authentication → URL Configuration
must be `https://pawsassociation.com` for `{{ .SiteURL }}` to be right.

| File | Supabase template |
|---|---|
| `magic-link.html` | Magic Link |
| `confirm-signup.html` | Confirm signup |
| `reset-password.html` | Reset password |
