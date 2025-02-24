<<<<<<< HEAD
// Importation des modules nécessaires
const express = require('express');
const fs = require('fs');
const app = express();

// Middleware pour parser les données JSON
app.use(express.json());

// Point de terminaison pour recevoir la géolocalisation
app.post('/track', (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    
    // Formatage de la donnée
    const log = `Latitude: ${latitude}, Longitude: ${longitude}, Précision: ${accuracy}m\n`;
    
    // Enregistrement des données dans un fichier 'locations.txt'
    fs.appendFileSync('locations.txt', log);
    console.log("Localisation reçue :", log);
    
    // Réponse JSON pour indiquer que la position a été enregistrée
    res.json({ message: "Position enregistrée" });
});

// Écoute sur le port 3000 (en local) ou sur un port dynamique pour Heroku
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur en écoute sur le port ${port}`));
=======
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
const requestIp = require('request-ip');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestIp.mw());

// Route pour recevoir les données de géolocalisation
app.post('/track', async (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    const ip = req.clientIp;
    
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const log = `IP: ${ip}, Latitude: ${latitude}, Longitude: ${longitude}, Précision: ${accuracy}m\n`;
    
    fs.appendFileSync('locations.txt', log);
    console.log("Localisation reçue :", log);

    // Envoyer un e-mail avec la localisation
    await sendEmail(ip, latitude, longitude, accuracy, googleMapsLink);

    res.json({ message: "Position enregistrée et envoyée par e-mail" });
});

// Fonction pour envoyer l'email
async function sendEmail(ip, latitude, longitude, accuracy, googleMapsLink) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Remplacez par votre email
            pass: process.env.EMAIL_PASS  // Remplacez par votre mot de passe d'application
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO, // Email où envoyer les données
        subject: 'Nouvelle localisation reçue',
        text: `IP: ${ip}\nLatitude: ${latitude}\nLongitude: ${longitude}\nPrécision: ${accuracy}m\nLien Google Maps: ${googleMapsLink}`
    };

    await transporter.sendMail(mailOptions);
}

// Lancer le serveur sur le port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
>>>>>>> 1c41730 (Premier commit)
