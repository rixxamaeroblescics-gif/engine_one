import { useState } from 'react';
import './App.css';
import GymLeaderForm from './components/GymLeaderForm';
import TeamDisplay from './components/TeamDisplay';
import HealthDashboard from './components/HealthDashboard';
import { generateTeam } from './engine/TeamEngine';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleGenerate = async (region, type) => {
    setLoading(true);
    setError(null);
    try {
      const teamResult = await generateTeam(region, type);
      setResult(teamResult);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Pokémon Team Engine</h1>
        <p>Generate Gym Leader defending teams based on region and type.</p>
        <button 
          className="diag-toggle-btn" 
          onClick={() => setShowDiagnostics(!showDiagnostics)}
        >
          {showDiagnostics ? 'Hide Diagnostics' : 'Show System Health'}
        </button>
      </header>

      {/* REMOVE THIS IN PROD */}
      {showDiagnostics && (
        <section className="diagnostics-overlay">
          <HealthDashboard />
        </section>
      )}

      <main>
        <section className="controls">
          <GymLeaderForm onGenerate={handleGenerate} loading={loading} />
          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="results">
          {loading && <div className="loading-spinner">Generating your team... This may take a moment.</div>}
          {!loading && result && <TeamDisplay result={result} />}
        </section>
      </main>

      <footer>
        <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a></p>
      </footer>
    </div>
  );
}

export default App;
