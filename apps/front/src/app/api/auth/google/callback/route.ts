import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: NextResponse) {
  const { searchParams } = new URL(req.url);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const accessToken = searchParams.get("accessToken");
  const userId = searchParams.get("userId");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const role = searchParams.get("role");
  const avatar = searchParams.get("avatar");
  const email = searchParams.get("email");

  if (!accessToken || !userId || !firstName)
    throw new Error("Google oauth failed!");

  const res = await fetch(`${BACKEND_URL}/auth/verify-token`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) throw new Error("jwt verification failed!");

  await createSession({
    user: {
      id: userId ?? undefined,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      avatar: avatar ?? undefined,
      role: role ?? undefined,
      email: email ?? undefined,
    },
    accessToken,
  });
  redirect("/");
}
