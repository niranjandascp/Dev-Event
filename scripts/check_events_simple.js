
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Reading .env.local from:', envPath);

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
console.log('URI Defined:', !!MONGODB_URI);

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Event.countDocuments();
    console.log('Event Count:', count);
    if (count > 0) {
        const events = await Event.find().limit(1);
        console.log('Sample Event:', events[0]);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
