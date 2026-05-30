/**
 * @fileoverview API service layer for interfacing with PokéAPI.
 * Adheres to standardized error handling and structural validation.
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * @typedef {Object} PokemonReference
 * @property {string} name
 * @property {string} url
 */

/**
 * Fetches a list of Pokémon references by type.
 * @param {string} type 
 * @returns {Promise<PokemonReference[]>}
 */
export const fetchPokemonByType = async (type) => {
  try {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch type ${type}`);
    }
    const data = await response.json();
    
    if (!data.pokemon || !Array.isArray(data.pokemon)) {
      throw new Error(`Malformed API response: 'pokemon' array missing for type ${type}`);
    }

    return data.pokemon.map(p => p.pokemon);
  } catch (error) {
    console.error(`[pokeApi] fetchPokemonByType Error:`, error);
    throw error;
  }
};

/**
 * Fetches specific details for a Pokémon.
 * @param {string} urlOrName 
 * @returns {Promise<Object>}
 */
export const fetchPokemonDetails = async (urlOrName) => {
  const url = urlOrName.startsWith('http') ? urlOrName : `${BASE_URL}/pokemon/${urlOrName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch details for ${urlOrName}`);
  }
  return await response.json();
};

/**
 * Fetches species data for a Pokémon.
 * @param {string} urlOrName 
 * @returns {Promise<Object>}
 */
export const fetchPokemonSpecies = async (urlOrName) => {
  const url = urlOrName.startsWith('http') ? urlOrName : `${BASE_URL}/pokemon-species/${urlOrName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch species for ${urlOrName}`);
  }
  return await response.json();
};

/**
 * Aggregates details and species data for a single Pokémon.
 * @param {string} name 
 * @returns {Promise<{details: Object, species: Object}>}
 */
export const getFullPokemonData = async (name) => {
  const [details, species] = await Promise.all([
    fetchPokemonDetails(name),
    fetchPokemonSpecies(name)
  ]);
  return { details, species };
};
