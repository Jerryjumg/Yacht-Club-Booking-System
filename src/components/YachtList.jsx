import { useState, useEffect } from 'react';
import { fetchYachts } from '../services/api';
import './YachtList.css';

function YachtList({ onSelectYacht }) {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  

  useEffect(() => {
    loadYachts();
  }, []);

  const loadYachts = () => {
    setLoading(true);
    fetchYachts()
      .then(data => {
        setYachts(data);
        setError('');
      })
      .catch(err => {
        setError(err.error || 'Failed to load yachts');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filteredYachts = yachts.filter(yacht => 
    yacht.name.toLowerCase().includes(filter.toLowerCase()) ||
    yacht.type.toLowerCase().includes(filter.toLowerCase()) ||
    yacht.homeHarbor.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading available yachts...</div>;
  }

  return (
    <div className="yacht-list">
      <div className="yacht-list-header">
        <h2>Available Yachts</h2>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, type, or harbor..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          {filter && (
            <button 
              onClick={() => setFilter('')}
              className="clear-search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {filter && (
        <div className="search-results-info">
          Found {filteredYachts.length} yacht{filteredYachts.length !== 1 ? 's' : ''} 
          {filteredYachts.length !== yachts.length && ` out of ${yachts.length}`}
        </div>
      )}
      
      <div className="yachts-grid">
        {filteredYachts.map(yacht => (
          <div key={yacht.id} className="yacht-card">
            <div className="yacht-header">
              <h3>{yacht.name}</h3>
              <span className="yacht-type">{yacht.type}</span>
            </div>
            
            <div className="yacht-details">
              <div className="detail-row">
                <span className="label">Home Harbor:</span>
                <span>{yacht.homeHarbor}</span>
              </div>
              <div className="detail-row">
                <span className="label">Capacity:</span>
                <span>{yacht.capacity} guests</span>
              </div>
              
              {yacht.amenities && yacht.amenities.length > 0 && (
                <div className="amenities">
                  <span className="label">Amenities:</span>
                  <div className="amenities-list">
                    {yacht.amenities.map(amenity => (
                      <span key={amenity} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => onSelectYacht(yacht)}
              className="button button-primary book-button"
            >
              Book This Yacht
            </button>
          </div>
        ))}
      </div>
      
      {filteredYachts.length === 0 && filter && (
        <div className="empty-state">
          <p>No yachts found matching "{filter}"</p>
          <button 
            onClick={() => setFilter('')}
            className="button button-secondary"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default YachtList;