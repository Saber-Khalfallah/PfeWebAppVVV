import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  email?: string;
};
export type Session = {
  user: SessionUser;
  accessToken: string;
};

const secretkey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretkey);

export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", session, {
    httpOnly: false,
    secure: false,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}
export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session: ", err);
    redirect("/auth/signin");
  }
}
export async function deleteSession() {
  await (await cookies()).delete("session");
}
