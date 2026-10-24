import z from "zod";

export const loginSchema = z.object({
  email: z.email("آدرس ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.email("آدرس ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("آدرس ایمیل معتبر نیست"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر داشته باشه")
      .max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمزهای عبور با هم مطابقت ندارن",
  });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type SignupFormValues = z.infer<typeof signupSchema>;
