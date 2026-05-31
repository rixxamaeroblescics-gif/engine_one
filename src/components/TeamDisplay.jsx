import React from 'react';

/**
 * TeamDisplay Component
 * Renders the generated Pokémon team with detailed reasoning for each selection.
 */
const TeamDisplay = ({ result }) => {
  if (!result) return null;

  const { region, type, team, model, explanation } = result;

  return (
    <div className="team-display">
      <header className="results-header">
        <h2>
          ANALYSIS COMPLETE: {region.toUpperCase()} {type.toUpperCase()} TEAM
        </h2>
        <div className="model-info-panel">
          <p><strong>ALGORITHM:</strong> {model}</p>
          <p className="global-explanation">{explanation}</p>
        </div>
      </header>

      <div className="pokemon-grid">
        {team.map((pokemon, index) => (
          <article key={pokemon.name} className="pokemon-card glass-card">
            <div className="card-header">
              <span className="rank-badge">#{index + 1}</span>
              <h3>{pokemon.displayName.toUpperCase()}</h3>
              <div className="optimal-badge">OPTIMAL CHOICE</div>
            </div>

            <div className="reasoning-section">
              <p className="optimal-reason">
                <span className="reason-label">ANALYSIS:</span> {pokemon.optimalReason}
              </p>
            </div>
            
            <div className="card-details">
              <div className="detail-item">
                <span className="label">ORIGIN:</span> {pokemon.nativeRegion}
              </div>
              <div className="detail-item">
                <span className="label">TYPE(S):</span> {pokemon.types.join(' / ').toUpperCase()}
              </div>
            </div>
            
            <div className="stats-container">
              <h4>CORE PERFORMANCE METRICS</h4>
              <div className="stats-grid">
                {Object.entries(pokemon.stats).map(([statName, value]) => (
                  <div key={statName} className="stat-row">
                    <span className="stat-name">{statName.replace('-', ' ').toUpperCase()}</span>
                    <span className="stat-value">{value}</span>
                  </div>
                ))}
                <div className="stat-row bst-row">
                  <span className="stat-name">TOTAL POWER (BST)</span>
                  <span className="stat-value">{pokemon.bst}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
