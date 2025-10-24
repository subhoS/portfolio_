import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message, recaptchaToken } = data || {};
    if (!email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA v3 token if secret is configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    if (recaptchaSecret) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: "Missing recaptcha token" },
          { status: 400 }
        );
      }
      // verify with Google
      const params = new URLSearchParams();
      params.append("secret", recaptchaSecret);
      params.append("response", recaptchaToken);
      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          body: params,
        }
      );
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success || (verifyJson.score && verifyJson.score < 0.3)) {
        return NextResponse.json(
          { error: "Failed recaptcha verification" },
          { status: 400 }
        );
      }
    }

    // TODO: Integrate with an email provider (SendGrid, Mailgun) or use Vercel/Netlify serverless integrations.
    // Example (commented): if process.env.SENDGRID_API_KEY then send email here.
    console.log("Contact form submission", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
