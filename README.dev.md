Developer setup & environment

1. Install dependencies

```bash
cd /Users/subhadeepdatta/code_env/portfolio-seo
npm install
```

2. Environment variables (create a `.env.local` file in project root):

Required for optional features:

- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 measurement ID (G-XXXX)
- `SEARCH_CONSOLE_VERIFICATION` - Google Search Console meta token (optional)
- `SITE_URL` - e.g. https://yourdomain.com (used to build sitemap and JSON-LD)
- `RECAPTCHA_SECRET` - reCAPTCHA v3 secret key (for contact spam protection)
- `SENDGRID_API_KEY` - optional, to send contact emails

3. Run dev server

```bash
npm run dev
```

4. Notes

- Replace `public/profile.svg` and `public/resume.pdf` with your real assets.
- The contact API validates reCAPTCHA when `RECAPTCHA_SECRET` is set and currently logs submissions to the server console. Wire to SendGrid or another provider for production.
- To enable Analytics, set `NEXT_PUBLIC_GA_ID`.
