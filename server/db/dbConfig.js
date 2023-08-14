const mongoose = require('mongoose');

const mon = {
    host: '159.75.159.8',
    port: '27017',
    user: 'user1', 
    password: '123456', 
    database: 'stock',
    connectTimeout: 5000
  }

let USERSchema = new mongoose.Schema({
    email: String,
    password: String
})

const USER = mongoose.model('USER',USERSchema);
  
module.exports = {mon,USER};
  