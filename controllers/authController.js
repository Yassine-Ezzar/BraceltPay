const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { pinCode, faceIdEnabled, touchIdEnabled, securityQuestion, securityAnswer } = req.body;
        const user = new User({ pinCode, faceIdEnabled, touchIdEnabled, securityQuestion, securityAnswer });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { pinCode, faceId, touchId } = req.body;
        const user = await User.findOne({ $or: [{ faceIdEnabled: faceId }, { touchIdEnabled: touchId }] });
        
        if (!user) return res.status(400).json({ message: 'User not found' });
        
        if (pinCode && !(await bcrypt.compare(pinCode, user.pinCode))) {
            return res.status(400).json({ message: 'Invalid PIN' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPin = async (req, res) => {
    try {
        const { securityQuestion, securityAnswer, faceId, touchId, newPin } = req.body;
        const user = await User.findOne({ securityQuestion, securityAnswer });
        
        if (!user && !faceId && !touchId) return res.status(400).json({ message: 'Invalid credentials' });
        
        user.pinCode = await bcrypt.hash(newPin, 10);
        await user.save();
        res.json({ message: 'PIN reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-pinCode');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};