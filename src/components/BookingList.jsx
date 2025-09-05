import { useState, useEffect } from 'react';
import { fetchBookings, cancelBooking, updateBooking } from '../services/api';
import './BookingList.css';

function BookingList({ onRefresh }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBookings();
    const interval = setInterval(() => {
      loadBookings();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadBookings = () => {
    setLoading(true);
    fetchBookings()
      .then(data => {
        setBookings(data);
        setError('');
      })
      .catch(err => {
        setError(err.error || 'Failed to load bookings');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelClick = (bookingId) => {
    setCancellingId(bookingId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellingId) return;
    
    cancelBooking(cancellingId)
      .then(() => {
        loadBookings();
        if (onRefresh) onRefresh();
        setShowConfirmModal(false);
        setCancellingId(null);
      })
      .catch(err => {
        setError(err.error || 'Failed to cancel booking');
        setShowConfirmModal(false);
        setCancellingId(null);
      });
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setCancellingId(null);
  };

  const handleEditClick = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      date: booking.date,
      timeSlot: booking.timeSlot,
      partySize: booking.partySize,
      catering: booking.specialRequests?.catering || '',
      occasion: booking.specialRequests?.occasion || '',
      route: booking.specialRequests?.route || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
  };

  const handleSaveEdit = (bookingId) => {
    const selectedDate = new Date(editForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Date must be in the future');
      return;
    }

    if (!editForm.timeSlot) {
      setError('Please select a time slot');
      return;
    }

    if (!editForm.partySize || editForm.partySize < 1) {
      setError('Please enter valid party size');
      return;
    }

    setSaving(true);
    setError('');
    const updates = {
      date: editForm.date,
      timeSlot: editForm.timeSlot,
      partySize: parseInt(editForm.partySize),
      specialRequests: {
        catering: editForm.catering,
        occasion: editForm.occasion,
        route: editForm.route
      }
    };
    
    updates.specialRequests = Object.fromEntries(
      Object.entries(updates.specialRequests).filter(([_, value]) => value)
    );
    
    updateBooking(bookingId, updates)
      .then(() => {
        loadBookings();
        setEditingId(null);
        setEditForm({});
      })
      .catch(err => {
        setError(err.error || 'Failed to update booking');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="booking-list">
      <h2>My Bookings</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't made any bookings yet.</p>
          <p>Click "Book a Yacht" to schedule your first experience!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
                <span className={`status ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
              {editingId === booking.id ? (
                <div className="edit-mode">
                  <div className="edit-field">
                    <label>Date:</label>
                    <input 
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="edit-field">
                    <label>Time Slot:</label>
                    <select 
                      value={editForm.timeSlot}
                      onChange={(e) => setEditForm({...editForm, timeSlot: e.target.value})}
                      className="edit-input"
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                      <option value="evening">Evening (5:00 PM - 9:00 PM)</option>
                      <option value="full-day">Full Day (8:00 AM - 6:00 PM)</option>
                    </select>
                  </div>
                  
                  <div className="edit-field">
                    <label>Party Size:</label>
                    <input 
                      type="number"
                      value={editForm.partySize}
                      onChange={(e) => setEditForm({...editForm, partySize: e.target.value})}
                      min="1"
                      max="12"
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="edit-field">
                    <label>Catering:</label>
                    <select 
                      value={editForm.catering}
                      onChange={(e) => setEditForm({...editForm, catering: e.target.value})}
                      className="edit-input"
                    >
                      <option value="">None</option>
                      <option value="light-snacks">Light Snacks & Beverages</option>
                      <option value="lunch">Lunch Service</option>
                      <option value="dinner">Dinner Service</option>
                      <option value="cocktails">Cocktails & Appetizers</option>
                      <option value="lobster-bake">New England Lobster Bake</option>
                    </select>
                  </div>
                  
                  <div className="edit-field">
                    <label>Special Occasion:</label>
                    <input 
                      type="text"
                      value={editForm.occasion}
                      onChange={(e) => setEditForm({...editForm, occasion: e.target.value})}
                      placeholder="e.g., Birthday, Anniversary"
                      className="edit-input"
                    />
                  </div>
                  
                  <div className="edit-field">
                    <label>Preferred Route:</label>
                    <select 
                      value={editForm.route}
                      onChange={(e) => setEditForm({...editForm, route: e.target.value})}
                      className="edit-input"
                    >
                      <option value="">Captain's Choice</option>
                      <option value="harbor-tour">Harbor Tour</option>
                      <option value="coastal-cruise">Coastal Cruise</option>
                      <option value="sunset-sail">Sunset Sail</option>
                      <option value="island-hop">Island Hopping</option>
                    </select>
                  </div>
                  
                  <div className="edit-actions">
                    <button 
                      onClick={handleCancelEdit}
                      className="button button-secondary"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(booking.id)}
                      className="button button-primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Yacht:</span>
                    <span>{booking.yachtId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Party Size:</span>
                    <span>{booking.partySize} guests</span>
                  </div>
                  
                  <div className="special-requests-section">
                    <div className="special-requests-header">
                      <span className="label">Special Requests:</span>
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleEditClick(booking)}
                          className="edit-button"
                          type="button"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    
                    <div className="requests-list">
                      {booking.specialRequests && Object.keys(booking.specialRequests).length > 0 ? (
                        Object.entries(booking.specialRequests).map(([key, value]) => (
                          <span key={key} className="request-item">
                            {key}: {value}
                          </span>
                        ))
                      ) : (
                        <span className="no-requests">No special requests</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {booking.status === 'pending' && editingId !== booking.id && (
                <div className="booking-actions">
                  <button 
                    onClick={() => handleCancelClick(booking.id)}
                    className="button button-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}


      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="modal-actions">
              <button 
                onClick={handleCancelModal}
                className="button button-secondary"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="button button-danger"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingList;