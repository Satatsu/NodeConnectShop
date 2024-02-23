const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: true,
        validate: [isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Password must be at least 6 characters long']
    },
    avatar: {
      type: String,
     // default: 'default.png'
    }
});

userSchema.post('save', function(doc, next) {
  console.log('new user was created successfully && saved to db', doc);
  console.log('lol');
  next();
});

  userSchema.pre('save',async function(next) {
    console.log('user about to be created successfully && saved ', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });  
  
//3
  userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password)
      console.log(auth);
      if (auth) {
        //return l'user si le pwd est correct
        return user;
      }
      throw new Error('incorrect password');
    }
    throw new Error('incorrect email');
  
  };


  const User = mongoose.model('user', userSchema);
  module.exports = User;