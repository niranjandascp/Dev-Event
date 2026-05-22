import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

const deleteEvent = async () => {
  try {
    const { default: connectDB } = await import('../lib/mongodb');
    const { default: Event } = await import('../database/event.model');

    await connectDB();
    console.log('Connected via connectDB');
    console.log('Database Name:', mongoose.connection.name);

    const count = await Event.countDocuments();
    console.log('Event count:', count);
    
    if (count > 0) {
        const events = await Event.find({}, 'title slug');
        console.log('Found events:', events.map(e => ({ title: e.title, slug: e.slug })));
        
        // Auto-delete the event if found
        const targetTitle = 'GitHub Universe 2025';
        const deleteResult = await Event.deleteOne({ title: targetTitle });
        if (deleteResult.deletedCount > 0) {
            console.log(`Successfully deleted "${targetTitle}"`);
        } else {
            console.log(`Event "${targetTitle}" not found in list.`);
        }

    } else {
        console.log('No events found in the database.');
    }

  } catch (error) {
    console.error('Error info:', error);
  } finally {
    process.exit();
  }
};

deleteEvent();
