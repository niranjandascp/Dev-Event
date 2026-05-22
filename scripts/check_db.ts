
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

async function check() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');
    
    const count = await Event.countDocuments();
    console.log('Event count:', count);
    
    const events = await Event.find({});
    console.log('Events found:', JSON.stringify(events, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

check();
