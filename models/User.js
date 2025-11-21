const mongooseUser = require('mongoose');
const userSchema = new mongooseUser.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    mobile: { type: String },        
    address: { type: String }
  },
  { timestamps: true }
);

module.exports = mongooseUser.model('User', userSchema);
