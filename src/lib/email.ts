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

export const emailVerificationContent = (url: string) => ({
  subject: "Verify your email address | Journalate",
  text: `Welcome to Journalate!

Thanks for creating your account. We're excited to have you with us.

Before you get started, please verify your email address using the link below:
${url}

If you didn't create a Journalate account, you can safely ignore this email.

Best regards,
The Journalate Team
`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email | Journalate</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05080B; font-family: Arial, Helvetica, sans-serif; color: #F3EDED;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #05080B; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #39312F; border-radius: 16px; overflow: hidden;">

                <!-- Brand Header -->
                <tr>
                  <td align="center" style="padding: 36px 24px 28px;">
                    <h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -1px; color: #F3EDED;">
                      Journalate<span style="color: #F65F09;">.</span>
                    </h1>
                  </td>
                </tr>

                <!-- Accent Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 2px; background-color: #F65F09;"></div>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 36px 32px 32px;">


                    <h2 style="margin: 0 0 18px; font-size: 26px; line-height: 1.4; font-weight: 700; color: #F3EDED;">
                      Welcome to Journalate!
                    </h2>

                    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.9; color: #CDC0BB;">
                      Thank you for joining Journalate. We're glad you're here.
                    </p>


                    <!-- Verification Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 28px;">
                      <tr>
                        <td align="center" bgcolor="#F65F09" style="border-radius: 8px;">
                          <a
                            href="${url}"
                            target="_blank"
                            style="display: inline-block; padding: 15px 36px; font-size: 15px; line-height: 1.4; font-weight: 700; color: #F3EDED; text-decoration: none; border-radius: 8px;"
                          >
                            Verify my email
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px 28px; background-color: #05080B; border-top: 1px solid #625D5C;">
                    <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.8; text-align: center; color: #CDC0BB;">
                      Didn't create a Journalate account? No worries — you can safely ignore this email.
                    </p>

                    <p style="margin: 12px 0 0; font-size: 12px; line-height: 1.8; text-align: center; color: #625D5C;">
                      &copy; ${new Date().getFullYear()} Journalate. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
});
