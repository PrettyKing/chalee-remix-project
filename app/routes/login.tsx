// app/routes/login.tsx
import { Form, useActionData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions";

const prisma = new PrismaClient();

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Invalid username or password" }, { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Login() {
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
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Login</button>
    </Form>
  );
}
