import React, { useState } from 'react';
import { REGIONS, TYPES } from '../constants/pokemon';

const GymLeaderForm = ({ onGenerate, loading }) => {
  const [region, setRegion] = useState(REGIONS[0].name);
  const [type, setType] = useState(TYPES[1]); // Fire

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(region, type);
  };

  return (
    <form onSubmit={handleSubmit} className="gym-leader-form">
      <div className="form-group">
        <label htmlFor="region">Region:</label>
        <select 
          id="region" 
          value={region} 
          onChange={(e) => setRegion(e.target.value)}
          disabled={loading}
        >
          {REGIONS.map(r => (
            <option key={r.name} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="type">Type Specialization:</label>
        <select 
          id="type" 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
        >
          {TYPES.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Team'}
      </button>
    </form>
  );
};

export default GymLeaderForm;
