import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; // use the path from the adapter guide
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { HttpError, route } from "./http";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendEmail } from "./email";
import {
  emailVerificationContent,
  resetPasswordContent,
} from "./email-contents";

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["user"];

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        ...resetPasswordContent(url),
      }).catch((err) => console.error("reset email failed", err));
    },
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        ...emailVerificationContent(url),
      }).catch((err) => console.error("ارسال ایمیل تأیید ناموفق بود", err));
    },
    autoSignInAfterVerification: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24,
  },
  plugins: [nextCookies()], // keep this last
});

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new HttpError(401, "وارد حساب کاربری نشده‌اید.");
  return session.user;
}

export const getUserSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/signup");
  return session;
};

export function authedRoute<A extends unknown[]>(
  fn: (user: SessionUser, ...args: A) => Promise<Response>,
) {
  return route(async (...args: A) => fn(await requireUser(), ...args));
}
