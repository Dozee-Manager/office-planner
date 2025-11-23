const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://raghibhabib000:Raghib%402002@freetier.qxfhcfa.mongodb.net/?retryWrites=true&w=majority&appName=FreeTier";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    const db = client.db("testDB");
    const collection = db.collection("users");

    await collection.insertOne({ name: "Raghib", created: new Date() });

    console.log("Connected and inserted sample data!");
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
