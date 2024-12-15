// app/routes/reset-password.tsx
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getSession } from "~/sessions";

const prisma = new PrismaClient();

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("userId")) return json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: Number(session.get("userId")) },
  });
  return json({ user });
};

export const action = async ({ request }:any) => {
  const formData = await request.formData();
  const password = formData.get("password");

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: Number(session.get("userId")) },
    data: { password: hashedPassword },
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