import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/medicare';

async function listCollections() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to DB:', mongoose.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const coll of collections) {
        const count = await mongoose.connection.db.collection(coll.name).countDocuments();
        console.log(`- ${coll.name}: ${count} documents`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

listCollections();
