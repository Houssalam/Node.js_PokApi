// Description: Ce fichier contient le code du serveur Node.js

// Import des modules

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// class Object carte pokemon
class CartePokemon {
  static id = 0;

  constructor(nom, type, imageSrc) {
    this.id = ++CartePokemon.id;
    this.nom = nom;
    this.type = type;
    this.imageSrc = imageSrc;
  }
}

// Récupérer la page index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Récupérer toutes les cartes Pokemon dans le fichier pokemonList.json methode GET
app.get("/cartes", (req, res) => {
  fs.readFile("pokemonList.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
      return;
    }
    const cartes = JSON.parse(data).cartesPokemon;
    res.send(cartes);
  });
});

// Récupérer une carte Pokemon spécifique en utilisant son nom dans le fichier pokemonList.json methode GET
app.get("/cartes/:nom", (req, res) => {
  // Code à écrire

  const nomCarte = req.params.nom;

  fs.readFile("pokemonList.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
      return;
    }
    const cartes = JSON.parse(data).cartesPokemon;
    const carteTrouvee = cartes.find((carte) => carte.nom === nomCarte);

    if (!carteTrouvee) {
      res
        .status(404)
        .send(`Carte Pokemon avec le nom ${nomCarte} n'a pas été trouvée`);
      return;
    }

    res.send(carteTrouvee);
  });
});

// Ajouter une carte Pokemon dans le fichier pokemonList.json methode POST
app.post("/cartes", (req, res) => {
  // Code à écrire
  const nom = req.body.nom;
  const type = req.body.type;
  const imageSrc = req.body.imageSrc;

  if (!nom || !type || !imageSrc) {
    res.status(400).send("Les champs nom, type et imageSrc sont obligatoires");
    return;
  }

  const nouvelleCarte = new CartePokemon(nom, type, imageSrc);
  fs.readFile("pokemonList.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
      return;
    }
    const pokemonList = JSON.parse(data);
    const dernierID = pokemonList.cartesPokemon.reduce(
      (maxID, carte) => Math.max(maxID, carte.id),
      0
    );
    nouvelleCarte.id = dernierID + 1;
    pokemonList.cartesPokemon.push(nouvelleCarte);
    fs.writeFile("pokemonList.json", JSON.stringify(pokemonList), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
        return;
      }
      res.send("La carte Pokemon a été ajoutée avec succès");
    });
  });
});

// Modifier une carte Pokemon à partir de son id dans le fichier pokemonList.json methode PUT
app.put("/cartes/:id", (req, res) => {
  // Code à écrire
  const id = parseInt(req.params.id);
  const nom = req.body.nom;
  const type = req.body.type;
  const imageSrc = req.body.imageSrc;

  if (!nom || !type || !imageSrc) {
    res.status(400).send("Les champs nom, type et imageSrc sont obligatoires");
    return;
  }

  fs.readFile("pokemonList.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
      return;
    }
    const pokemonList = JSON.parse(data);
    const carteIndex = pokemonList.cartesPokemon.findIndex(
      (carte) => carte.id === id
    );
    if (carteIndex === -1) {
      res.status(404).send(`Carte Pokemon avec l'id ${id} n'a pas été trouvée`);
      return;
    }
    pokemonList.cartesPokemon[carteIndex] = {
      id,
      nom,
      type,
      imageSrc,
    };
    fs.writeFile("pokemonList.json", JSON.stringify(pokemonList), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
        return;
      }
      res.send(`La carte Pokemon avec l'id ${id} a été modifiée avec succès`);
    });
  });
});

// Supprimer une carte Pokemon à partir de son nom dans le fichier pokemonList.json methode DELETE
app.delete("/cartes/:nom", (req, res) => {
  // Code à écrire
  const nomCarte = req.params.nom;

  fs.readFile("pokemonList.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
      return;
    }

    const pokemonList = JSON.parse(data);
    const index = pokemonList.cartesPokemon.findIndex(
      (carte) => carte.nom === nomCarte
    );

    if (index === -1) {
      res
        .status(404)
        .send(`Carte Pokemon avec le nom ${nomCarte} n'a pas été trouvée`);
      return;
    }

    pokemonList.cartesPokemon.splice(index, 1);

    fs.writeFile("pokemonList.json", JSON.stringify(pokemonList), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
        return;
      }

      res.send(
        `La carte Pokemon avec le nom ${nomCarte} a été supprimée avec succès`
      );
    });
  });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});

