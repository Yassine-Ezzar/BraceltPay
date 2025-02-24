const Location = require('../models/Location');

exports.updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    const location = new Location({ userId, latitude, longitude });
    await location.save();
    res.status(200).json({ message: 'Location updated', location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const { userId } = req.query;
    const location = await Location.findOne({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};