// app/routes/logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  await destroySession(session);
  return redirect("/");
};
