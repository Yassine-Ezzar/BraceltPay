const Tesseract = require('tesseract.js');

exports.extractCardInfo = async (image) => {
  const { data: { text } } = await Tesseract.recognize(image, 'eng');
  // Extraire les informations de la carte (simplifié)
  const cardNumber = text.match(/\d{16}/)?.[0];
  const expiryDate = text.match(/\d{2}\/\d{2}/)?.[0];
  const cvv = text.match(/\d{3,4}/)?.[0];
  const cardHolderName = text.match(/[A-Z\s]+/)?.[0].trim();

  return { cardNumber, expiryDate, cvv, cardHolderName };
};