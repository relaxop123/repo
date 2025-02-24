const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration du transporteur pour envoyer l'email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilise Gmail, mais tu peux changer pour un autre service
    auth: {
        user: process.env.EMAIL_USER, // Ton adresse email
        pass: process.env.EMAIL_PASS  // Le mot de passe ou le mot de passe spécifique à l'application
    }
});

// Endpoint pour recevoir la localisation et envoyer l'email
app.post('/track', (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    
    // Créer un lien Google Maps
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Préparer l'email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'totomama123@gmail.com',  // Destinataire
        subject: 'Localisation de l\'appareil',
        text: `Voici la localisation de l'appareil : \n\n Latitude: ${latitude} \n Longitude: ${longitude} \n Précision: ${accuracy}m \n\nCliquez ici pour voir sur Google Maps : ${googleMapsLink}`
    };

    // Envoyer l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erreur d\'envoi d\'email :', error);
            return res.status(500).json({ message: 'Erreur d\'envoi d\'email' });
        }
        console.log('Email envoyé : ' + info.response);
        res.status(200).json({ message: 'Email envoyé avec succès' });
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
