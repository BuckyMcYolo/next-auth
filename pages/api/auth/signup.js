import { connectToDB } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";
import { hash } from "bcryptjs";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  async function hashPassword(password) {
    // Path: next-auth/lib/auth.js
    const hashedPassword = await hash(password, 12); // Path: next-auth/lib/auth.js
    return hashedPassword; // Path: next-auth/lib/auth.js
  }

  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: "Invalid input - password should be at least 7 characters long.",
    });
    return;
  }

  const client = await connectToDB();
  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    client.close();
    return;
  }

  const thehashedPassword = await hashPassword(password);

  const result = await db
    .collection("users")
    .insertOne({ email: email, password: thehashedPassword });

  res.status(201).json({ message: "Created user" });
  client.close();
}

export default handler;
