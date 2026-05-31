import { fetchPokemonByType, getFullPokemonData } from '../services/pokeApi';
import { REGION_TO_GEN } from '../constants/pokemon';

/**
 * @typedef {Object} TeamMember
 * @property {string} name
 * @property {string} displayName
 * @property {string[]} types
 * @property {Object.<string, number>} stats
 * @property {number} bst
 * @property {string} nativeRegion
 */

/**
 * @typedef {Object} TeamResult
 * @property {string} region
 * @property {string} type
 * @property {TeamMember[]} team
 * @property {string} model
 * @property {string} explanation
 */

/**
 * Utility to process promises in sequential chunks to avoid API rate limiting.
 * @template T
 * @param {Array<() => Promise<T>>} factories 
 * @param {number} size 
 * @returns {Promise<PromiseSettledResult<T>[]>}
 */
async function processInChunks(factories, size) {
  const results = [];
  for (let i = 0; i < factories.length; i += size) {
    const chunk = factories.slice(i, i + size);
    const chunkResults = await Promise.allSettled(chunk.map(f => f()));
    results.push(...chunkResults);
  }
  return results;
}

/**
 * Generates a Gym Leader team based on region and type specialization.
 * Implements chunked concurrent fetching and BST-based selection.
 * 
 * @param {string} region 
 * @param {string} type 
 * @returns {Promise<TeamResult>}
 */
export const generateTeam = async (region, type) => {
  const targetGen = REGION_TO_GEN[region.toLowerCase()];
  if (!targetGen) throw new Error(`Unknown region: ${region}`);

  // 1. Fetch all pokemon of the type
  const pokemonList = await fetchPokemonByType(type.toLowerCase());

  // 2. Fetch full data in chunks to prevent network exhaustion (ISO/IEC 25010 Reliability)
  const factories = pokemonList.map(p => () => getFullPokemonData(p.name));
  const fullDataResults = await processInChunks(factories, 10);

  const nativePool = fullDataResults
    .filter(r => {
      if (r.status === 'rejected') {
        console.warn(`[TeamEngine] Skipping Pokémon due to fetch failure:`, r.reason);
        return false;
      }
      return true;
    })
    .map(r => r.value)
    .filter(p => p.species.generation.name === targetGen);

  if (nativePool.length === 0) {
    throw new Error(`No native ${type} Pokémon found in ${region}.`);
  }

  // 3. Score and Sort by BST (Base Stat Total)
  const scoredPool = nativePool.map(p => {
    const stats = p.details.stats.reduce((acc, s) => {
      acc[s.stat.name] = s.base_stat;
      return acc;
    }, {});
    
    const bst = Object.values(stats).reduce((a, b) => a + b, 0);
    
    return {
      name: p.details.name,
      displayName: p.species.names.find(n => n.language.name === 'en')?.name || p.details.name,
      types: p.details.types.map(t => t.type.name),
      stats,
      bst,
      nativeRegion: region
    };
  });

  // Sort by BST descending
  scoredPool.sort((a, b) => b.bst - a.bst);

  // 4. Select top 6 unique members and add reasoning
  const totalNative = scoredPool.length;
  const team = scoredPool.slice(0, 6).map((p, index) => ({
    ...p,
    optimalReason: `Ranked #${index + 1} most optimal ${type} choice in ${region} (out of ${totalNative} native candidates) based on its superior Base Stat Total of ${p.bst}.`
  }));

  // 5. Generate Explanation
  const explanation = generateExplanation(team, region, type);

  return {
    region,
    type,
    team,
    model: 'Heuristic BST-Ranking (ISO/IEC 25010 Robustness)',
    explanation
  };
};

/**
 * Generates an analytical explanation for the team selection.
 * @param {TeamMember[]} team 
 * @param {string} region 
 * @param {string} type 
 * @returns {string}
 */
const generateExplanation = (team, region, type) => {
  const avgBst = Math.round(team.reduce((acc, p) => acc + p.bst, 0) / team.length);
  const strongest = team[0].displayName;
  
  return `This ${type}-type lineup for ${region} was algorithmically selected from a native pool of ${team.length} candidates. ` +
         `The selection priority was based on Base Stat Total (BST) to ensure a high-performance defending team. ` +
         `The resulting squad maintains an average BST of ${avgBst}, anchored by ${strongest}. ` +
         `Network requests were throttled to ensure data integrity during generation.`;
};
