require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
    await mongoose.connect(process.env.DB_ONLINE_URI);

    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany(); // or drop()
        console.log(`Cleaned collection: ${key}`);
    }

    await mongoose.disconnect();
}

cleanDatabase().catch(console.error);
