import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  const [spriteCategory, setSpriteCategory] = useState('default');
  const { name } = useParams(); // Retrieve the name parameter from the URL

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon detail:', error);
      }
    };

    fetchPokemonDetail();
  }, [name]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const flavorTextEntries = pokemon.species?.flavor_text_entries || [];
  const allGenerations = Object.keys(pokemon.sprites.versions);

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <div style={{ overflowY: 'hidden' }}> {/* Hide overflow */}
        <select
          value={spriteCategory}
          onChange={(e) => setSpriteCategory(e.target.value)}
          style={{ marginBottom: '10px' }}
        >
          <option value="default">Default Sprites</option>
          <option value="other">Other Sprites</option>
          {allGenerations.map((generationKey) => {
            const generationNumeral = generationKey.split('-').pop().toUpperCase();
            return (
              <option key={generationKey} value={generationKey}>
                Gen {generationNumeral}
              </option>
            );
          })}
        </select>
        {/* Rendering sprites based on selected category */}
        {spriteCategory === 'default' && (
          <div>
            {Object.entries(pokemon.sprites).map(([category, sprites]) => {
              if (typeof sprites === 'string' && sprites !== null) {
                return (
                  <div key={category}>
                    <img src={sprites} alt={`${pokemon.name} ${category}`} />
                    <p>{category}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        {spriteCategory === 'other' && (
          <div>
            {Object.entries(pokemon.sprites.other).map(([category, sprites]) => {
              return Object.entries(sprites).map(([key, value]) => {
                if (value !== null && typeof value === 'string') {
                  return (
                    <div key={`${category}-${key}`}>
                      <img src={value} alt={`${pokemon.name} ${key}`} />
                      <p>{`${category} - ${key}`}</p>
                    </div>
                  );
                }
                return null;
              });
            })}
          </div>
        )}
        {allGenerations.includes(spriteCategory) && (
          <div>
            {Object.entries(pokemon.sprites.versions[spriteCategory]).map(([game, sprites]) => {
              return Object.entries(sprites).map(([form, url]) => {
                if (url !== null && typeof url === 'string') {
                  return (
                    <div key={`${game}-${form}`}>
                      <img src={url} alt={`${pokemon.name} ${form}`} />
                      <p>{`${game} - ${form}`}</p>
                    </div>
                  );
                }
                return null;
              });
            })}
          </div>
        )}
      </div>
      <h2>Pokedex Entries</h2>
      <ul>
        {flavorTextEntries.map((entry, index) => (
          <li key={index}>{entry.flavor_text}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetail;
