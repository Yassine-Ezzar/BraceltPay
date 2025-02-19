const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    pinCode: { type: String, required: true },
    faceIdEnabled: { type: Boolean, default: false },
    touchIdEnabled: { type: Boolean, default: false },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('pinCode')) return next();
    this.pinCode = await bcrypt.hash(this.pinCode, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);