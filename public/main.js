const apiUrl = "http://localhost:3000/cartes";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const pokemonList = document.getElementById("pokemonList");

    data.forEach((pokemon) => {
      const tr = document.createElement("tr");

      const nomTd = document.createElement("td");
      nomTd.textContent = pokemon.nom;
      tr.appendChild(nomTd);

      const typeTd = document.createElement("td");
      typeTd.textContent = pokemon.type;
      tr.appendChild(typeTd);

      const imageTd = document.createElement("td");
      const image = document.createElement("img");
      image.src = pokemon.image;
      imageTd.appendChild(image);
      tr.appendChild(imageTd);

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

      pokemonList.appendChild(tr);
    });
  })
  .catch((error) => console.error(error));

function deletePokemon(id) {
  // Code pour supprimer le Pokémon avec l'ID donné
  const deleteUrl = `http://localhost:3000/cartes/${id}`;
  fetch(deleteUrl, { method: "DELETE" })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}
