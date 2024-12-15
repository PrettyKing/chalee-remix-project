import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, NavLink, json, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { destroySession, getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const prisma = new PrismaClient();

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("userId")) return json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: Number(session.get("userId")) },
  });
  return json({ user });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const isLogin = user ? true : false;
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        {isLogin ? (
          <div className="flex flex-col items-center border border-red-950 p-[20px] rounded-md">
            <div className="font-bold">
              {user?.username} - {user?.role} - {user?.permissions}
            </div>
            <NavLink to="/reset-password" className="btn mt-[30px]">
              reset password
            </NavLink>
            <Form method="post">
              <button type="submit" className="mt-[20px]">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <NavLink to="/login" className="btn">
            Login
          </NavLink>
        )}
        {isLogin ? (
          <NavLink to="/admin/manage-users" className="btn">
            Manage Users
          </NavLink>
        ) : null}
        <NavLink to="/register" className="btn">
          Register User
        </NavLink>
      </div>
    </div>
  );
}
