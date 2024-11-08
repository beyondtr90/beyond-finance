import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  } else {
    try {
      await clientPromise;
    } catch (error) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
  }
  
  const db = client.db('beyond');
  return { db };
}