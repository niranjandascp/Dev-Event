
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const eventSchema = new mongoose.Schema({ title: String }, { strict: false });
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

async function checkEvents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Event.countDocuments({});
    console.log(`Total events found: ${count}`);
    
    if (count > 0) {
        const events = await Event.find({}).limit(3).select('title slug createdAt');
        console.log('Sample events:', JSON.stringify(events, null, 2));
    }

  } catch (error) {
    console.error('Error checking events:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkEvents();
