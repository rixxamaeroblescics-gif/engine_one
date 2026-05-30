export const REGIONS = [
  { name: 'Kanto', generation: 'generation-i' },
  { name: 'Johto', generation: 'generation-ii' },
  { name: 'Hoenn', generation: 'generation-iii' },
  { name: 'Sinnoh', generation: 'generation-iv' },
  { name: 'Unova', generation: 'generation-v' },
  { name: 'Kalos', generation: 'generation-vi' },
  { name: 'Alola', generation: 'generation-vii' },
  { name: 'Galar', generation: 'generation-viii' },
  { name: 'Paldea', generation: 'generation-ix' },
];

export const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

export const REGION_TO_GEN = REGIONS.reduce((acc, region) => {
  acc[region.name.toLowerCase()] = region.generation;
  return acc;
}, {});
