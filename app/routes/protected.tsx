// app/routes/protected.tsx
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";

export const loader = async ({ params, request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    return redirect("/login");
  }
  return null;
};

export default function Protected() {
  return <h1>Protected Page</h1>;
}