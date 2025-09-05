# Yacht Club Booking System

A luxury yacht experience booking platform where members can browse and book yacht trips, manage their bookings, and communicate special requests. This web application provides a complete booking system with user authentication, yacht fleet management, and real-time booking updates.

## What This Project Does

The Yacht Club Booking System is a full-stack web application that allows yacht club members to:
- Register accounts and authenticate securely
- Browse available luxury yachts with detailed specifications
- Make reservations with custom party sizes and special requests
- Manage existing bookings (view, edit, or cancel)
- Experience real-time updates on booking status

The system includes role-based permissions supporting members, crew, and administrators with different access levels and capabilities.

## Tech Stack
- **Frontend**: React + Vite SPA
- **Backend**: Express.js with RESTful API
- **Authentication**: Session-based using UUID cookies
- **Styling**: Pure CSS with semantic class names
- **Architecture**: Clean layered architecture with separated concerns

## Architecture

This project follows a clean layered architecture pattern:

### Data Layer (`models/`)
- **data.js**: Pure data storage and basic CRUD operations
- No business logic, just data management
- Separates state management from business rules

### Business Logic Layer (`services/`)
- **authService.js**: Authentication and authorization logic
- **bookingService.js**: Booking operations and business rules
- Contains validation, permissions, and business workflows

### Utilities Layer (`utils/`)
- **validation.js**: Input validation and sanitization
- **auth.js**: Authentication helper functions
- Reusable, pure functions with no side effects

### Presentation Layer (`server.js`)
- HTTP request/response handling only
- Route definitions and middleware
- Delegates all business logic to service layers

## How to Run

```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Start the server
npm start
```

Then open http://localhost:3000 in your browser.

## How to Use

1. **First Time Users**:
   - Click "Create account" on the login page
   - Enter a username (letters, numbers, hyphens, underscores only)
   - You'll be automatically logged in after registration

2. **Returning Users**:
   - Enter your username and click "Login"

3. **Booking a Yacht**:
   - Click "Book a Yacht" in the navigation
   - Browse available yachts and click "Book This Yacht"
   - Select date, time slot, and party size
   - Add any special requests (catering, occasions, route preferences)
   - Submit your booking

4. **Managing Bookings**:
   - View all your bookings in "My Bookings"
   - Cancel bookings if plans change
   - See booking status (pending, confirmed, completed)

## Test Accounts & Special Cases

For testing purposes, you can register with any username except:
- `dog` - This username is banned and will show an authorization error (demonstrates authorization failure handling)

No predefined usernames exist - all users must register before logging in. The system requires username registration before allowing login access, matching standard web application flows.

## API Endpoints

The application provides RESTful API endpoints:
- `POST /api/users/register` - Register new user
- `POST /api/session` - Login user
- `DELETE /api/session` - Logout user  
- `GET /api/session` - Check current session
- `GET /api/yachts` - Get available yachts (requires authentication)
- `GET /api/bookings` - Get user's bookings with optional status filtering
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking details
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/admin/bookings` - Get all bookings (admin/crew only)

## Security Features

- Session-based authentication with httpOnly UUID cookies
- Comprehensive input validation and sanitization
- Username restrictions and banned username handling
- Authorization checks on all protected endpoints
- Role-based permissions (member, crew, admin)
- XSS protection through React's automatic escaping
- Business logic separation prevents security bypasses

## Libraries and Resources

### Approved Libraries Used
- **React** (^19.1.0) - Frontend framework (MIT License)
- **React-DOM** (^19.1.0) - React DOM rendering (MIT License) 
- **Vite** (^7.0.4) - Build tool and development server (MIT License)
- **Express** (^4.21.2) - Backend web framework (MIT License)
- **Cookie-Parser** (^1.4.7) - Express cookie parsing middleware (MIT License)
- **ESLint** - Code linting and quality (MIT License)

### Fonts Used
- **Google Fonts** - Montserrat and Playfair Display fonts
  - Source: https://fonts.google.com/
  - License: Open Font License (OFL)
  - Used for typography enhancement

### Images and Media
- Background gradients and colors are CSS-generated
- No external images or media assets are used
- All visual elements are created with pure CSS

## Services Not Requiring Authentication

All API endpoints require authentication except:
- `POST /api/users/register` - New user registration
- `POST /api/session` - User login

This design ensures security while allowing necessary account creation and authentication flows.

## Author

zheng.jiey@northeastern.edu

## License

This project is for educational purposes as part of a web development course. All code is original work demonstrating web development skills and best practices.