// app/routes/reset-password.tsx
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const loader = async ({ request }:any) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return redirect("/invalid-token");
  }

  return json({ token });
};

export const action = async ({ request }:any) => {
  const formData = await request.formData();
  const token = formData.get("token");
  const password = formData.get("password");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return redirect("/login");
};

export default function ResetPassword() {
  const { token } = useLoaderData<any>();
  const actionData = useActionData<any>();
  return (
    <div>
      <h1>Reset Password</h1>
      <Form method="post">
        <input type="hidden" name="token" value={token} />
        <label>
          New Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Reset Password</button>
      </Form>
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  );
}