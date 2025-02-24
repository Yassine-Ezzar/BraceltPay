const axios = require('axios');
const Location = require('../models/Location');

exports.getNearbyOffers = async (latitude, longitude) => {
  try {
    // Appeler l'API OpenTripMap pour trouver des offres à proximité
    const response = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
      params: {
        radius: 1000, // Rayon de 1 km
        lat: latitude,
        lon: longitude,
        format: 'json',
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch nearby offers:', error);
    throw new Error('Failed to fetch nearby offers');
  }
};

exports.updateUserLocation = async (userId, latitude, longitude) => {
  try {
    // Enregistrer la localisation de l'utilisateur dans la base de données
    const location = new Location({ userId, latitude, longitude });
    await location.save();

    // Récupérer les offres à proximité
    const offers = await this.getNearbyOffers(latitude, longitude);

    return { success: true, offers };
  } catch (error) {
    console.error('Failed to update user location:', error);
    throw new Error('Failed to update user location');
  }
};