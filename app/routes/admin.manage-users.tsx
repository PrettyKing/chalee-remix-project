// app/routes/admin/manage-users.tsx
import { Form, useLoaderData, redirect } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "~/utils/auth";
import { User } from "~/data";

const prisma = new PrismaClient();

export const loader = async ({ params, request }: ActionFunctionArgs) => {
  await requireRole(request, "ADMIN");
  const users = await prisma.user.findMany();
  return json({ users });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireRole(request, "ADMIN");
  const formData = await request.formData();
  const userId = formData.get("userId");
  const role = formData.get("role");
  const permissions = formData.get("permissions");

  const roleString = role ? String(role) : undefined;
  const permissionsString = permissions ? String(permissions) : undefined;

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { role: roleString, permissions: permissionsString },
  });

  return redirect("/admin/manage-users");
};

export default function ManageUsers() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Manage Users</h1>
      <ul className="border mt-[30px]">
        <li className="w-full flex h-[66px]">
          {["Username", "Role", "Permissions", "Action"].map((item) => (
            <div key={item} className="manageUserItem font-bold">
              {item}
            </div>
          ))}
        </li>
        {users.map((user) => (
          <li key={user.id} className="w-full">
            <Form
              method="post"
              className="w-full flex justify-around items-center h-[88px]"
            >
              <input type="hidden" name="userId" value={user.id} />
              <div className="manageUserItem">{user.username}</div>
              <div className="manageUserItem">
                <select name="role" defaultValue={user.role}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="manageUserItem">
                <select name="permissions" defaultValue={user.permissions}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="manageUserItem">
                <button type="submit">Update</button>
              </div>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}
