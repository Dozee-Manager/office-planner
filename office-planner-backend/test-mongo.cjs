const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://raghibhabib000:Raghib%402002@freetier.qxfhcfa.mongodb.net/?retryWrites=true&w=majority&tls=true";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000
});

async function run() {
  try {
    await client.connect();
    const db = client.db("testDB");
    const collection = db.collection("users");
    await collection.insertOne({ name: "Raghib", created: new Date() });
    console.log("Connected and inserted sample data!");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
