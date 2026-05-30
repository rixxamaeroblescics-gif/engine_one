import React, { useState } from 'react';
import { runDiagnostics } from '../diagnostics/SystemHealth';

const HealthDashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const startCheck = async () => {
    setLoading(true);
    const diagResults = await runDiagnostics();
    setResults(diagResults);
    setLoading(false);
  };

  return (
    <div className="health-dashboard">
      <div className="dashboard-header">
        <h3>System Health Diagnostics (ISO/IEC 25010)</h3>
        <button onClick={startCheck} disabled={loading} className="diag-btn">
          {loading ? 'Running Tests...' : 'Execute Health Check'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="diag-results">
          {results.map((r, i) => (
            <div key={i} className={`diag-item ${r.status ? 'pass' : 'fail'}`}>
              <div className="diag-meta">
                <span className="status-indicator"></span>
                <strong>{r.name}</strong>
              </div>
              <div className="diag-info">
                <span>{r.message}</span>
                <span className="latency">{r.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
