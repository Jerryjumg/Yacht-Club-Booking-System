function fetchWithError(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'same-origin',
    })
    .then(response => {
      if (!response.ok) {
        return response.json()
          .then(error => Promise.reject(error))
          .catch(() => {
            let errorMessage;
            switch (response.status) {
              case 401:
                if (url.includes('/api/session') && options.method !== 'POST') {
                  errorMessage = 'Session expired. Please log in again';
                } else if (url.includes('/api/yachts')) {
                  errorMessage = 'Please create an account or log in to view available yachts';
                } else if (url.includes('/api/bookings')) {
                  errorMessage = 'Please create an account or log in to manage bookings';
                } else {
                  errorMessage = 'Please create an account or log in to access this feature';
                }
                break;
              case 403:
                errorMessage = 'You do not have permission to perform this action';
                break;
              case 404:
                errorMessage = 'The requested resource was not found';
                break;
              case 409:
                errorMessage = 'This action conflicts with existing data';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later';
                break;
              default:
                errorMessage = `Request failed (${response.status}). Please try again`;
            }
            return Promise.reject({ error: errorMessage });
          });
      }
      return response.json();
    })
    .catch(error => {
      if (error.error) {
        return Promise.reject(error);
      }
      return Promise.reject({ 
        error: 'Unable to connect to server. Please check your connection and try again.' 
      });
    });
  }
  
  export function register(username) {
    return fetchWithError('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }
  
  export function login(username) {
    return fetchWithError('/api/session', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }
  
  export function logout() {
    return fetchWithError('/api/session', {
      method: 'DELETE',
    });
  }
  
  export function fetchSession() {
    return fetchWithError('/api/session')
      .catch(error => {
        if (error.error === 'Please log in to access this feature') {
          return Promise.reject({ error: 'Session expired. Please log in again.' });
        }
        return Promise.reject(error);
      });
  }
  
  export function fetchYachts() {
    return fetchWithError('/api/yachts')
      .catch(error => {
        return Promise.reject(error);
      });
  }

  export function fetchBookings() {
    return fetchWithError('/api/bookings')
      .catch(error => {
        return Promise.reject(error);
      });
  }
  
  export function createBooking(bookingData) {
    return fetchWithError('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
  
  export function updateBooking(bookingId, updates) {
    return fetchWithError(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
  
  export function cancelBooking(bookingId) {
    return fetchWithError(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }