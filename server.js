require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const locationRoutes = require('./routes/locationRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/payments', paymentRoutes);
app.use('/location', locationRoutes);
// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connecté ✅")).catch(err => console.error(err));

// Serveur
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
