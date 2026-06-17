import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Birthday } from './models/Birthday';

const DEMO_EMAIL = 'demo@birthday-board.dev';
const DEMO_PASSWORD = 'Demo1234!';

const sampleBirthdays = [
  { name: 'Alice Johnson',    birthDate: new Date('1990-03-22'), note: 'Loves chocolate cake' },
  { name: 'Bob Smith',        birthDate: new Date('1985-07-04'), note: 'Basketball fan' },
  { name: 'Carol White',      birthDate: new Date('1992-11-08') },
  { name: 'David Brown',      birthDate: new Date('1988-01-30'), note: 'Send flowers' },
  { name: 'Emma Davis',       birthDate: new Date('1995-09-15') },
  { name: 'Frank Miller',     birthDate: new Date('1983-05-04'), note: 'Prefers surprises' },
  { name: 'Grace Wilson',     birthDate: new Date('1991-12-25') },
  { name: 'Henry Moore',      birthDate: new Date('1987-02-19'), note: 'Tech enthusiast' },
  { name: 'Isabella Taylor',  birthDate: new Date('1993-08-11') },
  { name: 'Jack Anderson',    birthDate: new Date('1989-10-28'), note: 'Vegetarian' },
  { name: 'Karen Thomas',     birthDate: new Date('1996-04-07') },
  { name: 'Leo Jackson',      birthDate: new Date('1984-06-16'), note: 'Guitar player' },
];

const seed = async () => {
  await connectDB();
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
    user = await User.create({ name: 'Demo User', email: DEMO_EMAIL, password: hashedPassword });
    console.log('Created demo user');
  }

  await Birthday.deleteMany({ createdBy: user._id });

  const today = new Date();
  const todayBirthday = {
    name: 'Today Person 🎂',
    birthDate: new Date(today.getFullYear() - 28, today.getMonth(), today.getDate()),
    note: 'Birthday is today!',
  };

  const all = [...sampleBirthdays, todayBirthday].map((b) => ({ ...b, createdBy: user!._id }));
  await Birthday.insertMany(all);
  console.log(`Seeded ${all.length} birthdays for ${DEMO_EMAIL}`);

  await mongoose.disconnect();
  console.log('Done! Log in with: demo@birthday-board.dev / Demo1234!');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
