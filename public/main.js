// URL de l'API à appeler
const apiUrl = "http://localhost:3000/cartes";

// Appel de la fonction Fetch pour récupérer les données depuis l'API
fetch(apiUrl)
  .then((response) => response.json()) // Conversion de la réponse en objet JSON
  .then((data) => {
    // Récupération de l'élément HTML où le tableau sera affiché
    const pokemonList = document.getElementById("pokemonList");

    // Boucle sur chaque Pokémon dans les données récupérées
    data.forEach((pokemon) => {
      // Création d'une nouvelle ligne dans le tableau HTML
      const tr = document.createElement("tr");

      // Création d'une cellule pour le nom du Pokémon
      const nomTd = document.createElement("td");
      nomTd.textContent = pokemon.nom;
      tr.appendChild(nomTd);

      // Création d'une cellule pour le type du Pokémon
      const typeTd = document.createElement("td");
      typeTd.textContent = pokemon.type;
      tr.appendChild(typeTd);

      // Création d'une cellule pour l'image du Pokémon
      const imageTd = document.createElement("td");
      const image = document.createElement("img");
      image.src = pokemon.imageSrc;
      image.style.width = "100px";
      image.style.height = "80px";
      imageTd.appendChild(image);
      tr.appendChild(imageTd);

      // Création d'une cellule pour le bouton de suppression du Pokémon
      const actionTd = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener("click", () => {
        // Fonction de suppression du Pokémon
        deletePokemon(pokemon.id);
        tr.remove(); // Supprime la ligne du tableau HTML
      });
      actionTd.appendChild(deleteButton);
      tr.appendChild(actionTd);

      // Ajout de la nouvelle ligne au tableau HTML
      pokemonList.appendChild(tr);
    });
  })
  .catch((error) => console.error(error));

// Fonction pour supprimer un Pokémon de la liste
function deletePokemon(id) {
  // URL pour supprimer le Pokémon avec l'ID correspondant
  const deleteUrl = `http://localhost:3000/cartes/${id}`;

  // Envoi de la requête Fetch avec la méthode "DELETE" pour supprimer le Pokémon
  fetch(deleteUrl, { method: "DELETE" })
    .then((response) => console.log(response)) // Affichage de la réponse dans la console si la suppression est réussie
    .catch((error) => console.error(error)); // Affichage de l'erreur dans la console si la suppression échoue
}

// Afficher une carte Pokemon spécifique
// Récupère le formulaire et écoute l'événement de soumission
const onePokeForm = document.forms.onePoke;
onePokeForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire
  const nom = onePokeForm.elements.nom.value; // Récupère la valeur du champ "nom" du formulaire
  const apiUrl = `http://localhost:3000/cartes?nom=${nom}`; // Construit l'URL de l'API avec le nom recherché

  // Envoie une requête HTTP GET à l'API et traite la réponse
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const cardDiv = document.getElementById("card"); // Récupère la div où afficher la carte

      // Supprime la carte précédemment affichée
      cardDiv.innerHTML = "";

      if (data.length === 0) {
        // Si la réponse est vide, affiche un message d'erreur
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Aucune carte trouvée";
        cardDiv.appendChild(errorMessage);
      } else {
        // Sinon, crée une carte pour le premier résultat de la réponse et l'affiche
        const pokemon = data[0];
        const card = createCard(pokemon);

        // Ajoute la classe "text-center" à la div contenant la carte pour centrer horizontalement
        cardDiv.classList.add("text-center");
        cardDiv.appendChild(card);
      }
    })
    .catch((error) => console.error(error)); // En cas d'erreur, affiche le message d'erreur dans la console
});

// Fonction pour créer une carte de Pokémon à partir des données renvoyées par l'API
function createCard(pokemon) {
  const card = document.createElement("div"); // Crée un élément div pour la carte
  card.classList.add("card"); // Ajoute la classe "card" à la carte

  const image = document.createElement("img"); // Crée un élément img pour l'image du Pokémon
  image.src = pokemon.imageSrc; // Définit l'URL de l'image à partir des données de l'API
  image.classList.add("card-img-top"); // Ajoute la classe "card-img-top" à l'image
  image.classList.add("mx-auto"); // Ajoute la classe "mx-auto" pour centrer l'image horizontalement
  image.style.width = "200px"; // Ajuste la taille de l'image
  image.style.height = "auto"; // Ajuste la taille de l'image
  card.appendChild(image); // Ajoute l'image à la carte

  const cardBody = document.createElement("div"); // Crée un élément div pour le corps de la carte
  cardBody.classList.add("card-body"); // Ajoute la classe "card-body" au corps de la carte

  const title = document.createElement("h5"); // Crée un élément h5 pour le titre (nom du Pokémon)
  title.classList.add("card-title"); // Ajoute la classe "card-title" au titre
  title.classList.add("text-center"); // Ajoute la classe "text-center" pour centrer le nom
  title.textContent = pokemon.nom; // Définit le contenu du titre à partir des données de l'API
  cardBody.appendChild(title); // Ajoute le titre au corps de la carte

  const type = document.createElement("p");
  type.classList.add("card-text");
  type.classList.add("text-center"); // Ajoute la classe "text-center" pour centrer le type
  type.textContent = pokemon.type;
  cardBody.appendChild(type);

  card.appendChild(cardBody);

  return card;
}

//Ajout du bouton Modifier
// Création d'une cellule pour le bouton de modification du Pokémon
const editTd = document.createElement("td");
const editButton = document.createElement("button");
editButton.textContent = "Modifier";
editButton.addEventListener("click", () => {
  // Fonction de modification du Pokémon
  editPokemon(pokemon.id);
});
editTd.appendChild(editButton);
tr.appendChild(editTd);

function editPokemon(id) {
  const pokemonUrl = `http://localhost:3000/cartes/${id}`;

  // Récupération des informations du Pokémon depuis l'API
  fetch(pokemonUrl)
    .then((response) => response.json())
    .then((pokemon) => {
      // Affichage d'une fenêtre modale pour modifier les informations du Pokémon
      const name = prompt("Nouveau nom", pokemon.nom);
      const type = prompt("Nouveau type", pokemon.type);
      const imageUrl = prompt("Nouvelle URL de l'image", pokemon.imageSrc);

      // Envoi de la requête Fetch avec la méthode "PUT" pour mettre à jour le Pokémon
      fetch(pokemonUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: name,
          type: type,
          imageSrc: imageUrl,
        }),
      })
        .then((response) => response.json())
        .then((updatedPokemon) => {
          // Mise à jour des informations du Pokémon dans le tableau HTML
          const row = document.querySelector(
            `tr[data-id="${updatedPokemon.id}"]`
          );
          row.children[0].textContent = updatedPokemon.nom;
          row.children[1].textContent = updatedPokemon.type;
          row.children[2].children[0].src = updatedPokemon.imageSrc;
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}
