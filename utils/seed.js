const connection = require('../config/connection');
const { User, Thought } = require('../models');

const users = [
  {
    username: 'irene',
    email: 'irene@google.com',
  },
  {
    username: 'johnsmith',
    email: 'johnsmith@google.com',
  }
];

connection.once('open', async () => {
  console.log('Connected!');

  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  await User.collection.insertMany(users);

  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});