import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
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

  const showdownSprites = pokemon.sprites.other.showdown;
  const cries = pokemon.cries;
  const renderImage = (url, key) => {
    return url && <img className='pkm-gif' key={key} src={url} alt={key} />;
  };

  const playCry = (cryUrl) => {
    const audio = new Audio(cryUrl);
    audio.play();
  };

  const hasFemaleForm = showdownSprites.front_female !== null;

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <button onClick={() => playCry(cries.latest)}>Play Cry</button>
      <div className='pokemon-image-container'>
        <div>
          {hasFemaleForm ? <h3>Male Form</h3> : null}
          {renderImage(showdownSprites.front_default, 'front_default')}
          {renderImage(showdownSprites.front_shiny, 'front_shiny')}
        </div>
        {hasFemaleForm && (
          <div>
            <h3>Female Form</h3>
            {renderImage(showdownSprites.front_female, 'front_female')}
            {renderImage(showdownSprites.front_shiny_female, 'front_shiny_female')}
          </div>
        )}
      </div>
      <h2>Pokedex Entries</h2>
      <ul>
        {pokemon.species && pokemon.species.flavor_text_entries && pokemon.species.flavor_text_entries.map((entry, index) => (
          <li key={index}>{entry.flavor_text}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetail;
