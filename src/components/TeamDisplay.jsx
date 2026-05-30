import React from 'react';

const TeamDisplay = ({ result }) => {
  if (!result) return null;

  const { region, type, team, model, explanation } = result;

  return (
    <div className="team-display">
      <h2>Gym Leader: {region} ({type.charAt(0).toUpperCase() + type.slice(1)} Specialty)</h2>
      
      <div className="model-info">
        <p><strong>Model Used:</strong> {model}</p>
        <p><strong>Explanation:</strong> {explanation}</p>
      </div>

      <div className="pokemon-grid">
        {team.map((pokemon, index) => (
          <div key={pokemon.name} className="pokemon-card">
            <h3>#{index + 1} {pokemon.displayName}</h3>
            <p><strong>Native Region:</strong> {pokemon.nativeRegion}</p>
            <p><strong>Types:</strong> {pokemon.types.join(', ')}</p>
            
            <div className="stats">
              <h4>Basic Stats:</h4>
              <ul>
                <li>HP: {pokemon.stats.hp}</li>
                <li>Attack: {pokemon.stats.attack}</li>
                <li>Defense: {pokemon.stats.defense}</li>
                <li>Sp. Attack: {pokemon.stats['special-attack']}</li>
                <li>Sp. Defense: {pokemon.stats['special-defense']}</li>
                <li>Speed: {pokemon.stats.speed}</li>
                <li><strong>BST: {pokemon.bst}</strong></li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
