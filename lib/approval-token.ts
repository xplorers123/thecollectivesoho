import crypto from "crypto";

const SECRET = process.env.APPROVAL_SECRET!;

export function createToken(email: string): string {
  return crypto.createHmac("sha256", SECRET).update(email.toLowerCase()).digest("hex");
}

export function verifyToken(email: string, token: string): boolean {
  const expected = createToken(email);
  try {
    return crypto.timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
