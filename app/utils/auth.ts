// app/utils/auth.ts
import { getSession } from "~/sessions";
import { PrismaClient } from "@prisma/client";
import { redirect } from "@remix-run/node";

const prisma = new PrismaClient();

export async function requireRole(request: Request, role: string) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== role) {
    throw redirect("/unauthorized");
  }

  return user;
}

export async function requirePermission(request: Request, permission: string) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // if (!user || !user.permissions.includes(permission)) {
  //   throw redirect("/unauthorized");
  // }

  return user;
}
