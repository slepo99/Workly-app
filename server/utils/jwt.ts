import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret",
)

export async function createJwt(payload: {
  userId: string
  role: string
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, secret)

  return payload
}