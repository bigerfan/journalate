export const emailVerificationContent = (url: string) => ({
  subject: "تأیید آدرس ایمیل | Journalate",
  text: `به Journalate خوش اومدی!

از اینکه حساب کاربری ساختی خوشحالیم.

برای شروع، لطفاً آدرس ایمیلت رو از طریق لینک زیر تأیید کن:
${url}

اگه تو حساب کاربری Journalate نساختی، می‌تونی این ایمیل رو نادیده بگیری.

با آرزوی موفقیت،
تیم Journalate
`,
  html: `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تأیید ایمیل | Journalate</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05080B; font-family: Tahoma, Arial, Helvetica, sans-serif; color: #F3EDED; direction: rtl;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #05080B; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #39312F; border-radius: 16px; overflow: hidden;">

                <!-- Brand Header -->
                <tr>
                  <td align="center" style="padding: 36px 24px 28px; direction: ltr;">
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
                  <td style="padding: 36px 32px 32px; text-align: right;">

                    <h2 style="margin: 0 0 18px; font-size: 26px; line-height: 1.8; font-weight: 700; color: #F3EDED;">
                      به Journalate خوش اومدی!
                    </h2>

                    <p style="margin: 0 0 16px; font-size: 15px; line-height: 2; color: #CDC0BB;">
                      از اینکه به Journalate پیوستی خوشحالیم. برای شروع، فقط کافیه آدرس ایمیلت رو تأیید کنی.
                    </p>

                    <!-- Verification Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 28px;">
                      <tr>
                        <td align="center" bgcolor="#F65F09" style="border-radius: 8px;">
                          <a
                            href="${url}"
                            target="_blank"
                            style="display: inline-block; padding: 15px 36px; font-size: 15px; line-height: 1.8; font-weight: 700; color: #F3EDED; text-decoration: none; border-radius: 8px;"
                          >
                            تأیید آدرس ایمیل
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 13px; line-height: 2; color: #CDC0BB;">
                      اگه این حساب کاربری رو خودت نساختی، کافیه این ایمیل رو نادیده بگیری.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px 28px; background-color: #05080B; border-top: 1px solid #625D5C;">
                    <p style="margin: 0 0 16px; font-size: 13px; line-height: 2; text-align: center; color: #CDC0BB;">
                      از Journalate استفاده نمی‌کنی؟ مشکلی نیست؛ می‌تونی این ایمیل رو نادیده بگیری.
                    </p>

                    <p style="margin: 12px 0 0; font-size: 12px; line-height: 2; text-align: center; color: #625D5C; direction: ltr;">
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

export const resetPasswordContent = (url: string) => ({
  subject: "تغییر رمز عبور | Journalate",
  text: `درخواست تغییر رمز عبور Journalate

برای انتخاب رمز عبور جدید، لینک زیر رو باز کن:
${url}

اگه درخواست تغییر رمز عبور ندادی، این ایمیل رو نادیده بگیر. رمز عبورت تغییر نمی‌کنه مگر اینکه لینک بالا رو باز کنی و رمز جدیدی انتخاب کنی.

با آرزوی موفقیت،
تیم Journalate
`,
  html: `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تغییر رمز عبور | Journalate</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05080B; font-family: Tahoma, Arial, Helvetica, sans-serif; color: #F3EDED; direction: rtl;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #05080B; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #39312F; border-radius: 16px; overflow: hidden;">

                <!-- Brand Header -->
                <tr>
                  <td align="center" style="padding: 36px 24px 28px; direction: ltr;">
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
                  <td style="padding: 36px 32px 32px; text-align: right;">

                    <h2 style="margin: 0 0 18px; font-size: 26px; line-height: 1.8; font-weight: 700; color: #F3EDED;">
                      تغییر رمز عبور
                    </h2>

                    <p style="margin: 0 0 16px; font-size: 15px; line-height: 2; color: #CDC0BB;">
                      برای حساب کاربری Journalate درخواست تغییر رمز عبور ثبت شده. برای انتخاب رمز عبور جدید، روی دکمه زیر بزن.
                    </p>

                    <!-- Reset Password Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 28px;">
                      <tr>
                        <td align="center" bgcolor="#F65F09" style="border-radius: 8px;">
                          <a
                            href="${url}"
                            target="_blank"
                            style="display: inline-block; padding: 15px 36px; font-size: 15px; line-height: 1.8; font-weight: 700; color: #F3EDED; text-decoration: none; border-radius: 8px;"
                          >
                            انتخاب رمز عبور جدید
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 16px; font-size: 13px; line-height: 2; color: #CDC0BB;">
                      اگه دکمه بالا کار نکرد، این لینک رو در مرورگرت باز کن:
                    </p>

                    <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; word-break: break-word; direction: ltr; text-align: left;">
                      <a href="${url}" target="_blank" style="color: #F65F09; text-decoration: underline;">
                        ${url}
                      </a>
                    </p>

                    <p style="margin: 0; font-size: 13px; line-height: 2; color: #CDC0BB;">
                      اگه این درخواست رو ثبت نکردی، این ایمیل رو نادیده بگیر. تا وقتی لینک رو باز نکنی و رمز جدیدی انتخاب نکنی، رمز عبورت تغییر نمی‌کنه.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px 28px; background-color: #05080B; border-top: 1px solid #625D5C;">
                    <p style="margin: 0 0 16px; font-size: 13px; line-height: 2; text-align: center; color: #CDC0BB;">
                      امنیت حساب کاربری‌ات مهمه. اگه درخواست تغییر رمز عبور ندادی، نیازی به انجام کاری نیست.
                    </p>

                    <p style="margin: 12px 0 0; font-size: 12px; line-height: 2; text-align: center; color: #625D5C; direction: ltr;">
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
