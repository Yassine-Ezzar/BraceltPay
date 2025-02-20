const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pinCode: { type: String, required: true },
    securityQuestion: { type: String, required: false },
    securityAnswer: { type: String, required: false },
    faceIdEnabled: { type: Boolean, default: false },
    touchIdEnabled: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
