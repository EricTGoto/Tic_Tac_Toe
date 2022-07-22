require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then((result) => {
    console.log('conntected');
  })
  .catch((result) => {
    console.log(result);
  });
