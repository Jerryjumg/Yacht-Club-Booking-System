import { useState, useEffect } from 'react';
import { logout } from '../services/api';
import BookingList from './BookingList';
import YachtList from './YachtList';
import BookingForm from './BookingForm';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('bookings');
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    onLogout();
  };

  const handleBookingCreated = () => {
    setSelectedYacht(null);
    setView('bookings');
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectYacht = (yacht) => {
    setSelectedYacht(yacht);
    setView('booking-form');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          className={`nav-button ${view === 'bookings' ? 'active' : ''}`}
          onClick={() => setView('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`nav-button ${view === 'yachts' ? 'active' : ''}`}
          onClick={() => setView('yachts')}
        >
          Book a Yacht
        </button>
        {user.role !== 'member' && (
          <button 
            className={`nav-button ${view === 'fleet' ? 'active' : ''}`}
            onClick={() => setView('fleet')}
          >
            Fleet Management
          </button>
        )}
      </nav>

      <div className="dashboard-content">
        {view === 'bookings' && (
          <BookingList 
            key={refreshKey} 
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}
        
        {view === 'yachts' && (
          <YachtList onSelectYacht={handleSelectYacht} />
        )}
        
        {view === 'booking-form' && selectedYacht && (
          <BookingForm 
            yacht={selectedYacht}
            onSuccess={handleBookingCreated}
            onCancel={() => {
              setSelectedYacht(null);
              setView('yachts');
            }}
          />
        )}
        
        {view === 'fleet' && user.role !== 'member' && (
          <div className="fleet-management">
            <h2>Fleet Management</h2>
            <p>Fleet management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;