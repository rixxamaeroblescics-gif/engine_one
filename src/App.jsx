import { useState } from 'react';
import './App.css';
import GymLeaderForm from './components/GymLeaderForm';
import TeamDisplay from './components/TeamDisplay';
import HealthDashboard from './components/HealthDashboard';
import { generateTeam } from './engine/TeamEngine';

/**
 * Main Application Component
 * Adheres to ISO 9241-11 usability standards and ISO/IEC 40500 (WCAG 2.0) accessibility guidelines.
 */
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
    <div className="app-container neo-pokedex-theme">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <span className="accent-text">NEO</span> POKÉDEX
          </h1>
          <p className="subtitle">Defensive Team Optimization Engine v2.0</p>
        </div>
        <button 
          className="diag-toggle-btn" 
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          aria-expanded={showDiagnostics}
          aria-controls="diagnostics-panel"
        >
          {showDiagnostics ? 'CLOSE DIAGNOSTICS' : 'SYSTEM HEALTH'}
        </button>
      </header>

      {showDiagnostics && (
        <section id="diagnostics-panel" className="diagnostics-overlay" aria-label="System Health Diagnostics">
          <HealthDashboard />
        </section>
      )}

      <main className="app-main">
        <section className="input-section" aria-label="Team Configuration">
          <GymLeaderForm onGenerate={handleGenerate} loading={loading} />
          
          <div role="alert" aria-live="assertive" className="error-container">
            {error && <div className="error-message">{error}</div>}
          </div>
        </section>

        <section 
          className="results-section" 
          aria-label="Generated Team Results" 
          aria-live="polite" 
          aria-busy={loading}
        >
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>OPTIMIZING LINEUP... ACCESSING POKÉAPI DATABASE</p>
            </div>
          )}
          
          {!loading && result && <TeamDisplay result={result} />}
        </section>
      </main>

      <footer className="app-footer">
        <p>
          PROTOCOL: SECURE | DATA SOURCE: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">POKÉAPI</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
