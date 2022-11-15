//Protecting the API route
import { getSession } from "next-auth/client";
//getSession can be used on server side and client side

import { connectToDB } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";
import { hash } from "bcryptjs";

async function hashPassword(password) {
  // Path: next-auth/lib/auth.js
  const hashedPassword = await hash(password, 12); // Path: next-auth/lib/auth.js
  return hashedPassword; // Path: next-auth/lib/auth.js
}

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const session = await getSession({ req: req });
  //This checks if the user is logged in
  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const client = await connectToDB();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsMatch = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsMatch) {
    res.status(403).json({ message: "Invalid password" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  client.close();
  res.status(200).json({ message: "Password updated" });
}
