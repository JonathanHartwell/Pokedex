import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactComponent as ShinyIcon } from "../icons/shiny.svg";

const PokemonCard = ({ pokemonId, showShiny }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [currentVarietyIndex, setCurrentVarietyIndex] = useState(0);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/pokemon/${pokemonId}`
        );
        setPokemonData(response.data);
      } catch (theseHands) {
        setError("Error fetching Pokemon data", theseHands);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  useEffect(() => {
    setIsShiny(showShiny);
  }, [showShiny]);

  const toggleIndividualShiny = (event) => {
    event.stopPropagation();
    setIsShiny((prevState) => !prevState); // Toggle the shiny state for this card
  };

  const toggleGender = (event) => {
    event.stopPropagation();
    setIsFemale((prevState) => !prevState); // Toggle the gender state for this card
  };

  const handleVarietiesClick = (event) => {
    event.stopPropagation();
    setCurrentVarietyIndex(
      (prevIndex) => (prevIndex + 1) % (pokemonData.varieties.length + 1)
    );
  };

  const handleMouseOver = () => {
    console.log("Pokemon Data:", pokemonData);
    if (pokemonData) {
      console.log("Varieties:", pokemonData.varieties);
      console.log("Varieties Length:", pokemonData.varieties.length);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  const {
    name,
    national_pokedex_number,
    sprite,
    sprite_shiny,
    sprite_f,
    sprite_f_shiny,
    varieties,
  } = pokemonData;

  const currentVariety =
    currentVarietyIndex === 0
      ? pokemonData
      : varieties[currentVarietyIndex - 1];

  // Function to get the correct name based on variety
  const getVarietyName = () => {
    const varietyName = currentVariety.name;
    if (varietyName.includes("-alola")) {
      return `alolan ${name}`;
    } else if (varietyName.includes("-hisui")) {
      return `hisuian ${name}`;
    } else if (varietyName.includes("-galar")) {
      return `galarian ${name}`;
    } else if (varietyName.includes("-paldea")) {
      return `paldean ${name}`;
    } else if (varietyName === "nidoran-f") {
      return "female Nidoran";
    } else if (varietyName === "nidoran-m") {
      return "male Nidoran";
    } else {
      return name; // Default to regular name if variety not recognized
    }
  };

  return (
    <div className="pokemon-card" onMouseOver={handleMouseOver}>
      <div className="pokemon-header">
        <h2 className="disable-select">{getVarietyName()}</h2>
        <p className="disable-select">#{national_pokedex_number}</p>
      </div>
      <img
        src={
          (isShiny && !isFemale && currentVariety.sprite_shiny) ||
          (isShiny && isFemale && currentVariety.sprite_f_shiny) ||
          (!isShiny && isFemale && currentVariety.sprite_f) ||
          currentVariety.sprite
        }
        alt={name}
        className="disable-select pkm-img"
      />
      <div className="pokemon-info">
        <div className="types-container">
          {currentVariety.types.map((type, index) => ( // Updated to use currentVariety.types
            <img
              key={index}
              src={`${process.env.PUBLIC_URL}/icons/${type}.png`}
              alt={type}
              className="type-icon disable-select"
            />
          ))}
        </div>
        <div className="icons-container">
          {currentVariety.sprite_shiny !== null && (
            <ShinyIcon
              src="/icons/shiny.svg"
              id="shiny-icon"
              alt="Shiny"
              className={`shiny-icon ${isShiny ? "default" : "shiny"} icon disable-select`}
              onClick={toggleIndividualShiny}
            />
          )}
          {currentVariety.sprite_f !== null && (
            <img
              src="/icons/gender.svg"
              className={`gender-icon ${isFemale ? "female" : "male"} icon disable-select`}
              id="gender-icon"
              alt="Gender"
              onClick={toggleGender}
            />
          )}
          {varieties.length >= 1 && (
            <img
              src="/icons/earth.svg"
              className="icon disable-select"
              id="varieties-icon"
              alt="Varieties"
              onClick={handleVarietiesClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;