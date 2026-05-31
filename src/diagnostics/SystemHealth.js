import { fetchPokemonDetails } from '../services/pokeApi';
import { generateTeam } from '../engine/TeamEngine';

/**
 * @typedef {Object} DiagnosticResult
 * @property {string} name
 * @property {boolean} status
 * @property {number} latency
 * @property {string} message
 */

/**
 * Runs a suite of diagnostic tests to ensure system health.
 * @returns {Promise<DiagnosticResult[]>}
 */
export const runDiagnostics = async () => {
  const results = [];

  // 1. API Connectivity Check
  results.push(await checkApiConnectivity());

  // 2. Data Schema Check
  results.push(await checkDataSchema());

  // 3. Engine Logic Check (Integration Test)
  results.push(await checkEngineLogic());

  return results;
};

const checkApiConnectivity = async () => {
  const start = performance.now();
  try {
    const response = await fetch('https://pokeapi.co/api/v2/');
    const latency = Math.round(performance.now() - start);
    return {
      name: 'PokeAPI Connectivity',
      status: response.ok,
      latency,
      message: response.ok ? 'Base URL reachable = ' : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      name: 'PokeAPI Connectivity',
      status: false,
      latency: 0,
      message: error.message
    };
  }
};

const checkDataSchema = async () => {
  const start = performance.now();
  try {
    const pikachu = await fetchPokemonDetails('pikachu');
    const latency = Math.round(performance.now() - start);
    
    // Validate critical properties exist
    const hasStats = pikachu.stats && Array.isArray(pikachu.stats);
    const hasTypes = pikachu.types && Array.isArray(pikachu.types);
    const isValid = hasStats && hasTypes;

    return {
      name: 'Data Schema Validation',
      status: isValid,
      latency,
      message: isValid ? 'Schema matches expected structure = ' : 'Missing stats/types in response'
    };
  } catch (error) {
    return {
      name: 'Data Schema Validation',
      status: false,
      latency: 0,
      message: error.message
    };
  }
};

const checkEngineLogic = async () => {
  const start = performance.now();
  try {
    // Run a small, deterministic test case (Kanto Fire - usually few members, very fast)
    const result = await generateTeam('Kanto', 'fire');
    const latency = Math.round(performance.now() - start);
    
    const isValid = result.team.length > 0 && result.team[0].bst > 0;

    return {
      name: 'Engine Core Logic',
      status: isValid,
      latency,
      message: isValid ? `Generated team of ${result.team.length}` : 'Engine returned empty/invalid team'
    };
  } catch (error) {
    return {
      name: 'Engine Core Logic',
      status: false,
      latency: 0,
      message: error.message
    };
  }
};
