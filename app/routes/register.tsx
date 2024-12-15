// app/routes/register.tsx
import { Form, useActionData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: "ADMIN",
      },
    });
    return redirect("/login");
  } catch (error) {
    return json({ error: "Username already exists" }, { status: 400 });
  }
};

export default function Register() {
  const actionData = useActionData<any>();

  return (
    <Form method="post">
      <div>
        <label>
          Username: <input type="text" name="username" />
        </label>
      </div>
      <div>
        <label>
          Password: <input type="password" name="password" />
        </label>
      </div>
      <div>
        <label>
          email: <input type="email" name="email" />
        </label>
      </div>
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Register</button>
    </Form>
  );
}
