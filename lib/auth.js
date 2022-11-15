import { hash, compare } from "bcryptjs"; // Path: next-auth/lib/auth.js

export async function hashPassword(password) {
  // Path: next-auth/lib/auth.js
  const hashedPassword = await hash(password, 12); // Path: next-auth/lib/auth.js
  return hashedPassword; // Path: next-auth/lib/auth.js
} // Path: next-auth/lib/auth.js

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
