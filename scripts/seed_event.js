
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

// Define Schema (matches event.model.ts roughly for seeding)
const EventSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    overview: String,
    image: String,
    venue: String,
    location: String,
    date: String,
    time: String,
    mode: String,
    audience: String,
    agenda: [String],
    organizer: String,
    tags: [String],
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Check if event already exists
    const existing = await Event.findOne({ slug: 'test-event-2025' });
    if (existing) {
        console.log('Test event already exists. Skipping.');
        process.exit(0);
    }

    const newEvent = new Event({
        title: 'Test Event 2025',
        slug: 'test-event-2025',
        description: 'This is a test event created by the agent.',
        overview: 'Testing the creation flow manually via script.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', // Use a stable demo image
        venue: 'Test Venue',
        location: 'Test Location',
        date: '2025-01-01',
        time: '10:00',
        mode: 'offline',
        audience: 'Testers',
        organizer: 'Agent',
        tags: ['test', 'agent'],
        agenda: ['Keynote', 'Wrap up'],
    });

    await newEvent.save();
    console.log('Test Event 2025 seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
      console.error('Seeding Error:', err);
      process.exit(1);
  });
