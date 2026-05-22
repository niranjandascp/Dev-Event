import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('MONGODB_URI is missing');
} else {
  try {
    // Basic parsing to hide credentials but show host/db
    const parts = uri.split('@');
    if (parts.length > 1) {
       const hostAndDb = parts[1];
       console.log('Connected to:', hostAndDb);
    } else {
       console.log('URI format not standard (might be local without auth or other):', uri);
    }
  } catch (e) {
    console.log('Error parsing URI');
  }
}
