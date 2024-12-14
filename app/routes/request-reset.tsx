// app/routes/request-reset.tsx
import { Form, useActionData, redirect } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { sendResetPasswordEmail } from "~/utils/email";

const prisma:any = new PrismaClient();

export const action = async ({ request }:any) => {
  const formData = await request.formData();
  const email = formData.get("email");

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = (crypto as any).randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      },
    });
    await sendResetPasswordEmail(user.email, token);
  }

  return redirect("/reset-requested");
};

export default function RequestReset() {
  const actionData = useActionData<any>();
  return (
    <Form method="post">
      <div>
        <label>
          Email: <input type="email" name="email" />
        </label>
      </div>
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Request Password Reset</button>
    </Form>
  );
}