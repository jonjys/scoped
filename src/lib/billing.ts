import { cookies } from "next/headers"

export const PRO_COOKIE = "scoped_pro"

export async function isProUnlocked() {
  const jar = await cookies()
  return jar.get(PRO_COOKIE)?.value === "1"
}
