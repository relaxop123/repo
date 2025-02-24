const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/track', (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    const log = `Latitude: ${latitude}, Longitude: ${longitude}, Précision: ${accuracy}m\n`;
    
    fs.appendFileSync('locations.txt', log);
    console.log("Localisation reçue :", log);

    res.json({ message: "Position enregistrée" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
