"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "@/lib/auth";

export async function handleLogin(username: string, password_input: string) {
  const isValid = await verifyCredentials(username, password_input);

  if (isValid) {
    cookies().set("khattak_mart_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    // Redirect is handled client-side on success in this setup now
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
