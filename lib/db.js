import { MongoClient } from "mongodb";

export async function connectToDB() {
  const client = await MongoClient.connect(
    `mongodb+srv://username123456:password123456@practice-app.wacwjze.mongodb.net/auth-demo?retryWrites=true&w=majority`
  );
  return client;
}
