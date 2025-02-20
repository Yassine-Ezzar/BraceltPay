const Card = require('../models/card');

exports.addCard = async (req, res) => {
    try {
        const { cardNumber, expiryDate, cvv, cardholderName } = req.body;
        const newCard = new Card({ cardNumber, expiryDate, cvv, cardholderName });
        await newCard.save();
        res.status(201).json({ message: 'Card added successfully', card: newCard });
    } catch (error) {
        res.status(500).json({ message: 'Error adding card', error });
    }
};

exports.getAllCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting card', error });
    }
};