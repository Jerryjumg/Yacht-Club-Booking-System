import { useState } from 'react';
import { createBooking } from '../services/api';
import './BookingForm.css';

function BookingForm({ yacht, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    partySize: '',
    specialRequests: {
      catering: '',
      occasion: '',
      route: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.date) {
      return 'Please select a date';
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Date must be in the future';
    }
    
    if (!formData.timeSlot) {
      return 'Please select a time slot';
    }
    
    if (!formData.partySize || formData.partySize < 1) {
      return 'Please enter party size';
    }
    
    if (formData.partySize > yacht.capacity) {
      return `Party size cannot exceed yacht capacity of ${yacht.capacity}`;
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setLoading(true);
    
    const bookingData = {
      yachtId: yacht.id,
      date: formData.date,
      timeSlot: formData.timeSlot,
      partySize: parseInt(formData.partySize),
      specialRequests: Object.fromEntries(
        Object.entries(formData.specialRequests).filter(([_, v]) => v)
      )
    };
    
    createBooking(bookingData)
      .then(() => {
        onSuccess();
      })
      .catch(err => {
        setError(err.error || 'Failed to create booking');
        setLoading(false);
      });
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('specialRequests.')) {
      const requestField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specialRequests: {
          ...prev.specialRequests,
          [requestField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h2>Book {yacht.name}</h2>
        <button 
          onClick={onCancel}
          className="close-button"
          type="button"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="yacht-summary">
          <h3>Yacht Details</h3>
          <p><strong>{yacht.type}</strong> - Capacity: {yacht.capacity} guests</p>
          <p>Home Harbor: {yacht.homeHarbor}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="booking-form-group">
          <label htmlFor="date">Select Date</label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="booking-form-input"
            required
          />
        </div>
        
        <div className="booking-form-group">
          <label htmlFor="timeSlot">Time Slot</label>
          <select
            id="timeSlot"
            value={formData.timeSlot}
            onChange={(e) => handleInputChange('timeSlot', e.target.value)}
            className="booking-form-input"
            required
          >
            <option value="">Select time slot</option>
            <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
            <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
            <option value="evening">Evening (5:00 PM - 9:00 PM)</option>
            <option value="full-day">Full Day (8:00 AM - 6:00 PM)</option>
          </select>
        </div>
        
        <div className="booking-form-group">
          <label htmlFor="partySize">Party Size</label>
          <input
            id="partySize"
            type="number"
            value={formData.partySize}
            onChange={(e) => handleInputChange('partySize', e.target.value)}
            min="1"
            max={yacht.capacity}
            className="booking-form-input"
            required
          />
          <small className="form-help">Maximum {yacht.capacity} guests</small>
        </div>
        
        <fieldset className="special-requests">
          <legend>Special Requests (Optional)</legend>
          
          <div className="booking-form-group">
            <label htmlFor="catering">Catering Preferences</label>
            <select
              id="catering"
              value={formData.specialRequests.catering}
              onChange={(e) => handleInputChange('specialRequests.catering', e.target.value)}
              className="booking-form-input"
            >
              <option value="">None</option>
              <option value="light-snacks">Light Snacks & Beverages</option>
              <option value="lunch">Lunch Service</option>
              <option value="dinner">Dinner Service</option>
              <option value="cocktails">Cocktails & Appetizers</option>
              <option value="lobster-bake">New England Lobster Bake</option>
            </select>
          </div>
          
          <div className="booking-form-group">
            <label htmlFor="occasion">Special Occasion</label>
            <input
              id="occasion"
              type="text"
              value={formData.specialRequests.occasion}
              onChange={(e) => handleInputChange('specialRequests.occasion', e.target.value)}
              placeholder="e.g., Birthday, Anniversary"
              className="booking-form-input"
            />
          </div>
          
          <div className="booking-form-group">
            <label htmlFor="route">Preferred Route</label>
            <select
              id="route"
              value={formData.specialRequests.route}
              onChange={(e) => handleInputChange('specialRequests.route', e.target.value)}
              className="booking-form-input"
            >
              <option value="">Captain's Choice</option>
              <option value="harbor-tour">Harbor Tour</option>
              <option value="coastal-cruise">Coastal Cruise</option>
              <option value="sunset-sail">Sunset Sail</option>
              <option value="island-hop">Island Hopping</option>
            </select>
          </div>
        </fieldset>
        
        <div className="form-actions">
          <button 
            type="button"
            onClick={onCancel}
            className="button button-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;

