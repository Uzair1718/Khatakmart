"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(username: string, password_input: string) {
  // In a real app, you'd validate against a database
  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "admin";

  if (username === validUsername && password_input === validPassword) {
    cookies().set("khattak_mart_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/admin");
    return { success: true, message: "Logged in successfully" };
  } else {
    return { success: false, message: "Invalid username or password" };
  }
}

export async function handleLogout() {
    cookies().delete("khattak_mart_auth");
    redirect("/admin/login");
}
