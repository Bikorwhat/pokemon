document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const pokemonInput = document.getElementById("pokemon-input");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  searchBtn.addEventListener("click", searchPokemon);
  pokemonInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchPokemon();
    }
  });

  function searchPokemon() {
    const searchTerm = pokemonInput.value.trim().toLowerCase();
    if (!searchTerm) return;

    fetch(`/api/pokemon/${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokémon not found");
        }
        return response.json();
      })
      .then((data) => {
        displayPokemon(data);
        errorDiv.classList.add("hidden");
        resultDiv.classList.remove("hidden");
      })
      .catch((error) => {
        resultDiv.classList.add("hidden");
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
      });
  }

  function displayPokemon(pokemon) {
    document.getElementById("pokemon-name").textContent = pokemon.name;
    document.getElementById("pokemon-id").textContent = pokemon.id;
    document.getElementById("pokemon-types").textContent =
      pokemon.types.join(", ");
    document.getElementById("pokemon-abilities").textContent =
      pokemon.abilities.join(", ");
    document.getElementById("pokemon-image").src = pokemon.image;
    document.getElementById("pokemon-image").alt = pokemon.name;
  }
});
