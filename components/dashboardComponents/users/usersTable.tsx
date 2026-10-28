"use client";

import {
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
  TableHeader,
  Button,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { Shield, UserX, UserCheck } from "lucide-react";
import { useCallback, useState } from "react";

import { User } from "@/auth";

export default function UsersTable({
  users: initialUsers,
}: {
  users: User[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const columns =
    initialUsers.length > 0
      ? Object.keys(initialUsers[0]).filter(
          (value) =>
            !["id", "created_at", "img_url", "is_active", "password"].includes(
              value
            )
        )
      : ["username", "email", "role"];

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case "username":
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] font-bold text-xs overflow-hidden">
              {user.img_url ? (
                <img
                  alt={user.username}
                  className="w-full h-full object-cover"
                  src={user.img_url}
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <span className="font-semibold text-sm text-[var(--text-primary)] block">
                {user.username}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {user.is_active ? "Active account" : "Suspended"}
              </span>
            </div>
          </div>
        );
      case "email":
        return (
          <span className="text-xs text-[var(--text-secondary)]">
            {user.email || "—"}
          </span>
        );
      case "role":
        return (
          <div className="flex gap-2 w-full max-w-[240px] items-center">
            <Select
              aria-label="Select role"
              className="w-32"
              classNames={{
                trigger:
                  "bg-[var(--surface-1)] shadow-none border border-[var(--border-color)] rounded-xl h-9",
              }}
              defaultSelectedKeys={[user.role]}
              size="sm"
              startContent={
                <Shield className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              }
              variant="flat"
              onSelectionChange={async (key) => {
                const [selectedKey] = Array.from(key);

                if (!selectedKey) return;
                const res = await fetch(`/api/users/${user.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-type": "Application/json",
                  },
                  body: JSON.stringify({
                    role: selectedKey,
                  }),
                });

                if (res.ok) {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === user.id
                        ? { ...u, role: selectedKey as "admin" | "user" }
                        : u
                    )
                  );
                  addToast({
                    title: `Role updated to ${selectedKey}`,
                    color: "success",
                    variant: "flat",
                  });
                } else {
                  addToast({
                    title: "Failed to update role",
                    color: "danger",
                    variant: "flat",
                  });
                }
              }}
            >
              <SelectItem key="admin">admin</SelectItem>
              <SelectItem key="user">user</SelectItem>
            </Select>

            <Button
              isIconOnly
              className="rounded-xl"
              color={user.is_active ? "danger" : "success"}
              size="sm"
              title={user.is_active ? "Disable User" : "Enable User"}
              variant="flat"
              onPress={async () => {
                const res = await fetch(`/api/users/${user.id}`, {
                  method: "PUT",
                  headers: {
                    "content-type": "Application/json",
                  },
                  body: JSON.stringify({
                    isActive: !user.is_active,
                  }),
                });

                if (res.ok) {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === user.id ? { ...u, is_active: !user.is_active } : u
                    )
                  );
                  addToast({
                    title: user.is_active ? "User disabled" : "User enabled",
                    color: "success",
                    variant: "flat",
                  });
                }
              }}
            >
              {user.is_active ? (
                <UserX className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </Button>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="pb-6 border-b border-[var(--border-color)]">
        <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
          Access Control
        </p>
        <h1 className="font-extrabold text-3xl text-[var(--text-primary)] tracking-tight">
          Users &amp; Permissions
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Manage registered accounts, administrative privileges, and access status.
        </p>
      </header>

      <div className="w-full bg-[var(--surface-2)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <Table
          removeWrapper
          aria-label="Users Table"
          className="w-full"
          classNames={{
            th: "bg-[var(--surface-3)] text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider h-11",
            td: "py-4 border-b border-[var(--border-color)] last:border-b-0",
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column}>{column.replace("_", " ")}</TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent={"No users found"} items={users}>
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-[var(--surface-3)]/40 transition-colors"
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
