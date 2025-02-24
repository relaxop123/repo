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
