const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Profile = require('../models/Profile');

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI;

const artists = [
  {
    username: 'LunarProducer',
    email: 'lunar@example.com',
    role: 'producer',
    displayName: 'Lunar Echoes',
    genres: ['Electronic', 'Lofi', 'Ambient'],
    location: 'Berlin, Germany',
    bio: 'Crafting celestial soundscapes and midnight grooves. 10+ years of synthesis experience.'
  },
  {
    username: 'CrimsonRhyme',
    email: 'crimson@example.com',
    role: 'rapper',
    displayName: 'Crimson Vane',
    genres: ['Hip-Hop', 'Trap'],
    location: 'Atlanta, GA',
    bio: 'Storytelling through the lens of the streets. Raw, unfiltered, and rhythmic.'
  },
  {
    username: 'NovaSoul',
    email: 'nova@example.com',
    role: 'musician',
    displayName: 'Nova Grace',
    genres: ['R&B', 'Soul', 'Jazz'],
    location: 'London, UK',
    bio: 'Neo-soul vocalist with a passion for vintage textures and modern harmonies.'
  },
  {
    username: 'BeatMaster_Flex',
    email: 'flex@example.com',
    role: 'engineer',
    displayName: 'Flex Miller',
    genres: ['Pop', 'Rock', 'Afrobeats'],
    location: 'Lagos, Nigeria',
    bio: 'Mixing and mastering engineer. I make your tracks sound like radio hits.'
  },
  {
    username: 'IndigoDreamer',
    email: 'indigo@example.com',
    role: 'artist',
    displayName: 'Indigo Moon',
    genres: ['Pop', 'Indie', 'Folk'],
    location: 'Seattle, WA',
    bio: 'Writing songs from a bedroom in the rain. Melancholy melodies for sunny days.'
  }
];

const seedArtists = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const data of artists) {
      // Check if user exists
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          username: data.username,
          email: data.email,
          password: 'Password123!', // Demo password
          role: data.role
        });
        console.log(`User ${user.username} created`);
      }

      // Check if profile exists
      let profile = await Profile.findOne({ user: user._id });
      if (!profile) {
        profile = await Profile.create({
          user: user._id,
          displayName: data.displayName,
          bio: data.bio,
          genres: data.genres,
          location: data.location,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName)}&background=8A2BE2&color=fff&size=256`
        });
        console.log(`Profile for ${data.displayName} created`);
      }
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedArtists();
