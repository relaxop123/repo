require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/track', async (req, res) => {
    const { latitude, longitude, accuracy, ip } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Coordonnées GPS manquantes" });
    }

    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Configurer Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'totomama123@gmail.com',
        subject: 'Nouvelle localisation reçue',
        text: `Position GPS reçue :
Latitude: ${latitude}
Longitude: ${longitude}
Précision: ${accuracy}m
IP: ${ip}

Google Maps: ${googleMapsLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès !");
        res.json({ message: "Position envoyée par email !" });
    } catch (error) {
        console.error("Erreur d'envoi de l'email :", error);
        res.status(500).json({ error: "Erreur d'envoi de l'email" });
    }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
