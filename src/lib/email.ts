import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resend) {
    return;
  }
  const { error } = await resend.emails.send({
    from: `Journalate <${process.env.EMAIL_FROM!}>`,
    ...opts,
  });
  if (error) throw new Error(`Email send failed: ${error.message}`);
}
