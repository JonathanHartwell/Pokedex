import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';

function HomePage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const response = await axios.get('http://localhost:8000/pokemon');
        console.log('API Response:', response.data); // Log the API response
        if (Array.isArray(response.data)) {
          const data = response.data.map(pokemon => ({
            ...pokemon,
            generation: pokemon.generation // Ensure 'generation' exists in your data structure
          }));
          console.log('Transformed Data:', data); // Log the transformed data
          setPokemonList(data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    }

    fetchPokemonList();
  }, []);
  

  useEffect(() => {
    console.log("Pokemon List:", pokemonList);
  }, [pokemonList]);

  const handleGenerationFilter = (generation) => {
    setSelectedGeneration(generation);
  };

  console.log("Selected Generation:", selectedGeneration);

  return (
    <div>
      <div className="generation-filter">
        <button onClick={() => handleGenerationFilter("generation-i")}>Gen 1</button>
        {/* Add buttons for other generations if needed */}
      </div>
      <div className="pokemon-container">
        {pokemonList.map((pokemon, index) => {
          // console.log("Pokemon Generation:", pokemon.generation);
          // console.log("Comparison Result:", selectedGeneration === pokemon.generation);
          return (
            // Render all Pokemon cards if no generation is selected,
            // or if the selected generation matches the Pokemon's generation
            !selectedGeneration || selectedGeneration === pokemon.generation ? (
              <PokemonCard key={index} pokemonId={pokemon.id} />
            ) : null
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
